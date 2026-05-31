import { createFileRoute } from "@tanstack/react-router";
import { CampaignsListPage } from "@/features/campaigns/CampaignsListPage";

export const Route = createFileRoute("/_authenticated/campaigns")({
  head: () => ({ meta: [{ title: "Campanhas — Cevaroli" }] }),
  component: CampaignsListPage,
});
