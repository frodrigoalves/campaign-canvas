import { mockRequest } from "@/lib/api/client";
import { mockCampaigns } from "@/lib/mocks/campaigns";
import { mockUsers } from "@/lib/mocks/users";
import type { User } from "@/types/user.types";

export type EditorialPage = {
  id: string;
  campaignId: string;
  name: string;
  status: "draft" | "ready" | "published";
  createdAt: string;
  updatedAt: string;
};

export type EditorialModule = {
  id: string;
  pageId: string;
  title: string;
  layout: "full" | "half" | "hero";
  createdAt: string;
};

export type EditorialSlot = {
  id: string;
  moduleId: string;
  name: string;
  assignedBuyerId: string | null;
  createdAt: string;
};

export type CreatePageData = {
  name: string;
  status?: EditorialPage["status"];
};

export type CreateModuleData = {
  title: string;
  layout?: EditorialModule["layout"];
};

export type CreateSlotData = {
  name: string;
};

const pages: EditorialPage[] = mockCampaigns.slice(0, 4).map((campaign, index) => ({
  id: `page-${index + 1}`,
  campaignId: campaign.id,
  name: `${campaign.name} - Página ${index + 1}`,
  status: index === 0 ? "draft" : index === 1 ? "ready" : "published",
  createdAt: new Date(Date.now() - (index + 7) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - (index + 2) * 24 * 60 * 60 * 1000).toISOString(),
}));

const modules: EditorialModule[] = pages.flatMap((page, index) => [
  {
    id: `module-${index * 2 + 1}`,
    pageId: page.id,
    title: "Banner Principal",
    layout: "hero",
    createdAt: page.createdAt,
  },
  {
    id: `module-${index * 2 + 2}`,
    pageId: page.id,
    title: "Mix de Cartaz",
    layout: "half",
    createdAt: page.createdAt,
  },
]);

const slots: EditorialSlot[] = modules.flatMap((module, index) => [
  {
    id: `slot-${index * 2 + 1}`,
    moduleId: module.id,
    name: "Posição Superior",
    assignedBuyerId: null,
    createdAt: module.createdAt,
  },
  {
    id: `slot-${index * 2 + 2}`,
    moduleId: module.id,
    name: "Posição Inferior",
    assignedBuyerId:
      index % 3 === 0 ? (mockUsers.find((u) => u.role === "buyer")?.id ?? null) : null,
    createdAt: module.createdAt,
  },
]);

function getBuyer(id: string | null): User | null {
  return id ? (mockUsers.find((user) => user.id === id) ?? null) : null;
}

export const editorialService = {
  async listPages(campaignId: string) {
    const data = pages.filter((page) => page.campaignId === campaignId);
    return mockRequest(data);
  },

  async createPage(campaignId: string, data: CreatePageData) {
    const page: EditorialPage = {
      id: `page-${pages.length + 1}`,
      campaignId,
      name: data.name,
      status: data.status ?? "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pages.push(page);
    return mockRequest(page);
  },

  async listModules(pageId: string) {
    const data = modules.filter((module) => module.pageId === pageId);
    return mockRequest(data);
  },

  async createModule(pageId: string, data: CreateModuleData) {
    const module: EditorialModule = {
      id: `module-${modules.length + 1}`,
      pageId,
      title: data.title,
      layout: data.layout ?? "half",
      createdAt: new Date().toISOString(),
    };
    modules.push(module);
    return mockRequest(module);
  },

  async listSlots(moduleId: string) {
    const data = slots
      .filter((slot) => slot.moduleId === moduleId)
      .map((slot) => ({
        ...slot,
        assignedBuyer: getBuyer(slot.assignedBuyerId),
      }));
    return mockRequest(data);
  },

  async createSlot(moduleId: string, data: CreateSlotData) {
    const slot: EditorialSlot = {
      id: `slot-${slots.length + 1}`,
      moduleId,
      name: data.name,
      assignedBuyerId: null,
      createdAt: new Date().toISOString(),
    };
    slots.push(slot);
    return mockRequest(slot);
  },

  async assignSlot(slotId: string, buyerId: string) {
    const slot = slots.find((item) => item.id === slotId);
    if (!slot) {
      throw new Error("Slot não encontrado.");
    }
    slot.assignedBuyerId = buyerId;
    return mockRequest({
      ...slot,
      assignedBuyer: getBuyer(slot.assignedBuyerId),
    });
  },
};
