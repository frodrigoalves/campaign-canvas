import { mockRequest } from "@/lib/api/client";
import type {
  PmzCalcResult,
  ProductWithCommercial,
  OfferType,
  ExposureType,
} from "@/types/product.types";

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  event_type: string;
  user_id: string;
  before_data: unknown | null;
  after_data: unknown | null;
  created_at: string;
}

export interface PmzCalcInput {
  pmz: number;
  promotionalPrice: number;
  sellOutValue?: number;
  insertValue?: number;
}

export interface PromotionalItemSavePayload {
  id: string;
  campaignId: string;
  slotId: string;
  product: ProductWithCommercial;
  descriptionNewspaper: string;
  offerType: OfferType;
  exposureType: ExposureType;
  sellOutValue: number;
  sellOutAgreementNumber: string;
  insertValue: number;
  insertBoxAgreementNumber: string;
  promotionalPrice: number;
  pmzNew: number;
  offerMarginPercent: number;
}

const auditLog: AuditLogEntry[] = [];

export const promotionalItemsService = {
  async calculatePmz(input: PmzCalcInput): Promise<PmzCalcResult> {
    const { pmz, promotionalPrice, sellOutValue = 0, insertValue = 0 } = input;
    const novoPmz = Math.max(0, +(pmz - sellOutValue - insertValue * 0.5).toFixed(2));
    const margin =
      promotionalPrice > 0 ? ((promotionalPrice - novoPmz) / promotionalPrice) * 100 : 0;
    const status: PmzCalcResult["status"] = margin < 0 ? "critical" : margin < 8 ? "warn" : "ok";
    return mockRequest({ novoPmz, marginPercent: +margin.toFixed(2), status }, 200);
  },

  async saveItem(payload: PromotionalItemSavePayload, userId: string) {
    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      entity_type: "promotional_item",
      entity_id: payload.id,
      event_type: "save",
      user_id: userId,
      before_data: null,
      after_data: payload,
      created_at: new Date().toISOString(),
    };

    auditLog.push(auditEntry);

    return mockRequest({ ...payload, status: "filled" }, 200);
  },
};

export function getAuditLog() {
  return [...auditLog];
}
