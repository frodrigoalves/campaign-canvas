import { EventEmitter } from "events";
import type { ProductCommercialData } from "@/types/product.types";

export const importWorker = new EventEmitter();

// Mock storage for now — replace with DB persistence later
export const mockImportedCommercials: ProductCommercialData[] = [];

export async function processCsvStream(stream: NodeJS.ReadableStream) {
  return new Promise<{ processed: number }>((resolve, reject) => {
    // use csv-parse in streaming mode at runtime
    // @ts-expect-error csv-parse has inconsistent module exports
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const parse = require("csv-parse");
    const parser = parse({ columns: true, delimiter: ";", relax_column_count: true });

    const batchSize = 1000;
    let batch: ProductCommercialData[] = [];
    let processed = 0;

    function processBatch(items: ProductCommercialData[]) {
      // mock processing: push to in-memory storage
      mockImportedCommercials.push(...items);
      processed += items.length;
      importWorker.emit("progress", { processed });
    }

    parser.on("readable", () => {
      let record: Record<string, unknown>;

      while ((record = parser.read())) {
        // Map CSV columns to ProductCommercialData
        const mapped: ProductCommercialData = {
          productId: String(record.SEQPRODUTO ?? record.seqproduto ?? record.SeqProduto ?? ""),
          filial: record.NROEMPRESA ? `Filial ${record.NROEMPRESA}` : "01 - Matriz",
          pmz: parseFloat(record.PMZSEGMENTOPRINC ?? record.PMZ ?? "0") || 0,
          salePrice: parseFloat(record.MAXPRECOVDAEMPRESA ?? record.VALOR ?? "0") || 0,
          abcCurve: (record.ABC_FAMILIA_GERAL ?? "") as "A" | "B" | "C",
          storeRole: record.PAPEL_NA_LOJA ?? "",
          salesTrend: record.TENDENCIA_VENDA ?? "",
          priceSensitivity: (record.SENSIBILIDADE_PRECO ?? "") as "high" | "medium" | "low",
          lifecycle: record.CICLO_DE_VIDA ?? "",
          stockQty: parseInt(record.ESTOQUE_ATUAL ?? "0", 10) || 0,
          avgSales30d: parseInt(record.QTD_VENDIDA_MES_VIGENTE ?? "0", 10) || 0,
          lowestCompetitorPrice90d: parseFloat(record.CMULTCUSLIQUIDOEMP ?? "0") || 0,
          competitorResearchDate: new Date().toISOString(),
          competitorName: record.CATEGORIA_N1 ?? "",
        };

        batch.push(mapped);
        if (batch.length >= batchSize) {
          processBatch(batch);
          batch = [];
        }
      }
    });

    parser.on("end", () => {
      if (batch.length) processBatch(batch);
      importWorker.emit("done", { processed });
      resolve({ processed });
    });

    parser.on("error", (err: Error) => reject(err));

    stream.pipe(parser);
  });
}

export default { importWorker, processCsvStream, mockImportedCommercials };
