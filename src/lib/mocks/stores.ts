import type { Store, Cluster } from "@/types/campaign.types";

export const mockClusters: Cluster[] = [
  { id: "cl-1", name: "Metropolitano BH" },
  { id: "cl-2", name: "Interior Norte" },
];

export const mockStores: Store[] = [
  { id: "st-1", name: "Cevaroli BH Centro", city: "Belo Horizonte", clusterId: "cl-1" },
  { id: "st-2", name: "Cevaroli Caeté", city: "Caeté", clusterId: "cl-2" },
  { id: "st-3", name: "Cevaroli Nazaré", city: "Nova União", clusterId: "cl-2" },
];
