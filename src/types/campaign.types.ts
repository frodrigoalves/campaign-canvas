export type CampaignType =
  | "promotional_print"
  | "commercial"
  | "seasonal"
  | "opportunity"
  | "stock"
  | "regional"
  | "digital"
  | "only_app";

export type CampaignStatus =
  | "draft"
  | "configured"
  | "open"
  | "filling"
  | "review"
  | "approved"
  | "exported";

export interface Store {
  id: string;
  name: string;
  city: string;
  clusterId: string;
}

export interface Cluster {
  id: string;
  name: string;
}

export interface CampaignBuyer {
  userId: string;
  name: string;
  department: string;
  slotsAssigned: number;
  slotsFilled: number;
}

export interface CampaignDeadlines {
  filling: string;
  review: string;
  layout: string;
  approval: string;
  export: string;
  digital?: string;
}

export interface Campaign {
  id: string;
  name: string;
  code: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  deadlines: CampaignDeadlines;
  stores: Store[];
  clusters: Cluster[];
  buyers: CampaignBuyer[];
  totalSlots: number;
  filledSlots: number;
  createdAt: string;
  updatedAt: string;
}
