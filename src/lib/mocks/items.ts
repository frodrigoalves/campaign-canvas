import type { PromotionalItem } from "@/types/product.types";
import { mockCampaigns } from "./campaigns";
import { mockProducts } from "./products";
import { mockUsers } from "./users";

const OFFER_TYPES: PromotionalItem["offerType"][] = [
  "simple_price",
  "de_por",
  "this_package",
  "take_x_pay_y",
  "app_price",
  "combo",
  "opportunity",
];

const EXPOSURE_TYPES: PromotionalItem["exposureType"][] = ["single", "box", "insert", "highlight"];

const STATUSES: PromotionalItem["status"][] = ["pending", "filled", "review", "approved"];

const buyers = mockUsers.filter((user) => user.role === "buyer");

export const mockPromotionalItems: PromotionalItem[] = Array.from({ length: 20 }, (_, index) => {
  const campaign = mockCampaigns[index % mockCampaigns.length];
  const product = mockProducts[index % mockProducts.length];
  const status = STATUSES[index % STATUSES.length];
  const offerType = OFFER_TYPES[index % OFFER_TYPES.length];
  const exposureType = EXPOSURE_TYPES[index % EXPOSURE_TYPES.length];
  const buyer = buyers[index % buyers.length] ?? buyers[0];
  const promotionalPrice = +(product.commercial.salePrice * (0.78 + (index % 5) * 0.04)).toFixed(2);
  const pmzNew = Math.max(0, +(product.commercial.pmz - 0.25 + (index % 4) * 0.12).toFixed(2));
  // determine margin and force some critical/warn cases for testing
  let offerMarginPercent = promotionalPrice
    ? +(((promotionalPrice - pmzNew) / promotionalPrice) * 100).toFixed(1)
    : 0;

  // Force 3 critical margin items (< 0%) and 4 warning margin items (< 5%)
  const criticalIndices = [2, 5, 11];
  const warnIndices = [1, 4, 7, 9];
  if (criticalIndices.includes(index)) {
    // set promotional price below pmzNew to create negative margin
    const forcedPrice = +(pmzNew * 0.9).toFixed(2);
    offerMarginPercent = forcedPrice
      ? +(((forcedPrice - pmzNew) / forcedPrice) * 100).toFixed(1)
      : 0;
  } else if (warnIndices.includes(index)) {
    // set promotional price slightly above pmzNew to create a small margin (<5%)
    const forcedPrice = +(pmzNew * 1.02).toFixed(2) || promotionalPrice;
    offerMarginPercent = forcedPrice
      ? +(((forcedPrice - pmzNew) / forcedPrice) * 100).toFixed(1)
      : 0;
  }

  return {
    id: `item-${index + 1}`,
    campaignId: campaign.id,
    slotId: `slot-${(index % 8) + 1}`,
    product: product.product,
    commercial: product.commercial,
    descriptionNewspaper: `${product.product.description} promoção especial Cevaroli`,
    offerType,
    exposureType,
    sellOutValue: index % 3 === 0 ? 1.2 * (index + 1) : 0,
    sellOutAgreementNumber: index % 3 === 0 ? `SO-${index + 100}` : "",
    insertValue: index % 4 === 0 ? 0.8 * (index + 1) : 0,
    insertBoxAgreementNumber: index % 4 === 0 ? `BOX-${index + 200}` : "",
    promotionalPrice,
    pmzNew,
    offerMarginPercent,
    status,
    imageId: null,
    notes: `Oferta sazonal em ${campaign.name} para ${product.product.familyName}.`,
  };
});
