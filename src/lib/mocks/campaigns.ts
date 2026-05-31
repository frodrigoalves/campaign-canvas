import type { Campaign, CampaignStatus, CampaignType } from "@/types/campaign.types";
import { mockClusters, mockStores } from "./stores";
import { mockUsers } from "./users";

const buyers = mockUsers.filter((u) => u.role === "buyer");

function buildBuyers(count: number, totalSlots: number, filledSlots: number) {
  const selected = buyers.slice(0, count);
  const perBuyer = Math.floor(totalSlots / selected.length);
  return selected.map((b, i) => ({
    userId: b.id,
    name: b.name,
    department: b.allowedCategories[0] ?? "Geral",
    slotsAssigned: perBuyer,
    slotsFilled: Math.min(perBuyer, Math.floor((filledSlots / selected.length) + (i % 2))),
  }));
}

function iso(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

const base: Array<Partial<Campaign> & { name: string; code: string; type: CampaignType; status: CampaignStatus; totalSlots: number; filledSlots: number; startOffset: number; endOffset: number }> = [
  { name: "Folheto Quinzenal Janeiro #02", code: "FQ-2025-02", type: "promotional_print", status: "filling", totalSlots: 80, filledSlots: 34, startOffset: 2, endOffset: 14 },
  { name: "Encarte Verão Frutas & Verduras", code: "FLV-2025-V01", type: "seasonal", status: "open", totalSlots: 40, filledSlots: 5, startOffset: 7, endOffset: 21 },
  { name: "Oportunidade Bebidas Carnaval", code: "OPP-2025-CRN", type: "opportunity", status: "review", totalSlots: 24, filledSlots: 24, startOffset: 10, endOffset: 20 },
  { name: "Comercial Bazar Limpeza", code: "COM-2025-LL", type: "commercial", status: "approved", totalSlots: 32, filledSlots: 32, startOffset: -2, endOffset: 12 },
  { name: "Estoque Higiene Encalhe", code: "EST-2025-H01", type: "stock", status: "draft", totalSlots: 18, filledSlots: 0, startOffset: 14, endOffset: 28 },
  { name: "Regional Caeté Aniversário", code: "REG-2025-CT", type: "regional", status: "configured", totalSlots: 50, filledSlots: 0, startOffset: 21, endOffset: 35 },
  { name: "App Exclusivo Fim de Semana", code: "APP-2025-04", type: "only_app", status: "exported", totalSlots: 16, filledSlots: 16, startOffset: -7, endOffset: 0 },
  { name: "Digital Push Meio do Mês", code: "DIG-2025-MM", type: "digital", status: "filling", totalSlots: 28, filledSlots: 12, startOffset: 1, endOffset: 10 },
];

export const mockCampaigns: Campaign[] = base.map((b, i) => ({
  id: `c-${i + 1}`,
  name: b.name,
  code: b.code,
  description: `Campanha ${b.name} — Grupo Cevaroli.`,
  type: b.type,
  status: b.status,
  startDate: iso(b.startOffset),
  endDate: iso(b.endOffset),
  deadlines: {
    filling: iso(b.startOffset - 5),
    review: iso(b.startOffset - 3),
    layout: iso(b.startOffset - 2),
    approval: iso(b.startOffset - 1),
    export: iso(b.startOffset),
    digital: b.type === "digital" || b.type === "only_app" ? iso(b.startOffset + 1) : undefined,
  },
  stores: mockStores,
  clusters: mockClusters,
  buyers: buildBuyers(Math.min(4, buyers.length), b.totalSlots, b.filledSlots),
  totalSlots: b.totalSlots,
  filledSlots: b.filledSlots,
  createdAt: iso(-30),
  updatedAt: iso(-1),
}));
