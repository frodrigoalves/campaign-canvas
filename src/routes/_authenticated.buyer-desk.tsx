import { createFileRoute } from "@tanstack/react-router";
import { BuyerDeskPage } from "@/features/buyer-desk/BuyerDeskPage";

export const Route = createFileRoute("/_authenticated/buyer-desk")({
  head: () => ({ meta: [{ title: "Mesa do Comprador — Cevaroli" }] }),
  component: BuyerDeskPage,
});
