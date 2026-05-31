import { AlertCircle, ImagePlus, RefreshCw } from "lucide-react";
import type { ProductWithCommercial, OfferType } from "@/types/product.types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface LivePreviewPanelProps {
  description: string;
  promotionalPrice: number;
  offerType: OfferType;
  product: ProductWithCommercial | null;
  charError: boolean;
}

export function LivePreviewPanel({
  description,
  promotionalPrice,
  offerType,
  product,
  charError,
}: LivePreviewPanelProps) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between">
        <span className="section-label">Preview do Slot</span>
        <RefreshCw size={13} strokeWidth={1.5} className="text-[var(--text-tertiary)]" />
      </div>
      <div className="mt-3 rounded-lg border border-[var(--border-default)] bg-white p-6">
        <div className="grid h-48 w-full place-items-center rounded border border-dashed border-neutral-300 text-neutral-400">
          <div className="flex flex-col items-center gap-1">
            <ImagePlus size={28} strokeWidth={1.2} />
            <span className="text-[12px]">Sem imagem</span>
          </div>
        </div>
        <div className="mt-4 text-[16px] text-neutral-900">
          {description || product?.product.description || "Produto"}
        </div>
        <div className="mt-1 font-mono text-[28px] font-bold text-neutral-900">
          {promotionalPrice ? formatBRL(promotionalPrice) : "R$ —"}
        </div>
        {offerType === "de_por" && product && (
          <div className="font-mono text-[12px] text-neutral-500 line-through">
            De {formatBRL(product.commercial.salePrice)}
          </div>
        )}
      </div>
      {charError && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--status-critical-muted)] px-2 py-1 text-[11px] text-[var(--status-critical)]">
          <AlertCircle size={12} /> Texto estourado
        </div>
      )}
    </div>
  );
}
