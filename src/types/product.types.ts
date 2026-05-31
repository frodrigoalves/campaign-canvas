export interface Product {
  id: string;
  seqproduto: string;
  codProd: string;
  description: string;
  descriptionErp: string;
  familyCode: string;
  familyName: string;
  department: string;
  supplier: string;
}

export interface ProductCommercialData {
  productId: string;
  filial: string;
  pmz: number;
  salePrice: number;
  abcCurve: "A" | "B" | "C";
  storeRole: string;
  salesTrend: string;
  priceSensitivity: "high" | "medium" | "low";
  lifecycle: string;
  stockQty: number;
  avgSales30d: number;
  lowestCompetitorPrice90d: number;
  competitorResearchDate: string;
  competitorName: string;
}

export interface ProductWithCommercial {
  product: Product;
  commercial: ProductCommercialData;
}

export type OfferType =
  | "simple_price"
  | "de_por"
  | "this_package"
  | "take_x_pay_y"
  | "app_price"
  | "combo"
  | "opportunity";

export type ExposureType = "single" | "box" | "insert" | "highlight";

export interface PromotionalItem {
  id: string;
  campaignId: string;
  slotId: string;
  product: Product;
  commercial: ProductCommercialData;
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
  status: "pending" | "filled" | "review" | "approved" | "rejected";
  imageId: string | null;
  notes: string;
}

export interface PmzCalcResult {
  novoPmz: number;
  marginPercent: number;
  status: "ok" | "warn" | "critical";
}
