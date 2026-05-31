import { mockRequest } from "@/lib/api/client";
import type { PmzCalcResult } from "@/types/product.types";

export interface PmzCalcInput {
  pmz: number;
  promotionalPrice: number;
  sellOutValue?: number;
  insertValue?: number;
}

export const promotionalItemsService = {
  async calculatePmz(input: PmzCalcInput): Promise<PmzCalcResult> {
    const { pmz, promotionalPrice, sellOutValue = 0, insertValue = 0 } = input;
    const novoPmz = Math.max(0, +(pmz - sellOutValue - insertValue * 0.5).toFixed(2));
    const margin = promotionalPrice > 0 ? ((promotionalPrice - novoPmz) / promotionalPrice) * 100 : 0;
    const status: PmzCalcResult["status"] =
      margin < 0 ? "critical" : margin < 8 ? "warn" : "ok";
    return mockRequest({ novoPmz, marginPercent: +margin.toFixed(2), status }, 200);
  },
};
