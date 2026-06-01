import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CampaignsListPage, campaignsQueryOptions } from "@/features/campaigns/CampaignsListPage";

const searchSchema = z.object({
  search: z.string().optional(),
  type: z
    .enum([
      "all",
      "promotional_print",
      "commercial",
      "seasonal",
      "opportunity",
      "stock",
      "regional",
      "digital",
      "only_app",
    ])
    .optional(),
  status: z
    .enum(["all", "draft", "configured", "open", "filling", "review", "approved", "exported"])
    .optional(),
  page: z.coerce.number().min(1).default(1).optional(),
});

export const Route = createFileRoute("/_authenticated/campaigns")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ context: { queryClient }, search }) =>
    queryClient.ensureQueryData(campaignsQueryOptions(search)),
  head: () => ({ meta: [{ title: "Campanhas — Cevaroli" }] }),
  component: CampaignsListPage,
});
