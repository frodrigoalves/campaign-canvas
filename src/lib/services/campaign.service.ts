import { mockRequest } from "@/lib/api/client";
import { mockCampaigns } from "@/lib/mocks/campaigns";
import type { Campaign, CampaignStatus, CampaignType } from "@/types/campaign.types";
import type { PaginatedResponse } from "@/types/api.types";

export interface CampaignListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: CampaignType | "all";
  status?: CampaignStatus | "all";
}

export const campaignService = {
  async list(params: CampaignListParams = {}): Promise<PaginatedResponse<Campaign>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    let data = [...mockCampaigns];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
      );
    }
    if (params.type && params.type !== "all") {
      data = data.filter((c) => c.type === params.type);
    }
    if (params.status && params.status !== "all") {
      data = data.filter((c) => c.status === params.status);
    }
    const total = data.length;
    const start = (page - 1) * pageSize;
    const paged = data.slice(start, start + pageSize);
    return mockRequest({
      data: paged,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  },
  async getById(id: string): Promise<Campaign | null> {
    return mockRequest(mockCampaigns.find((c) => c.id === id) ?? null);
  },
};
