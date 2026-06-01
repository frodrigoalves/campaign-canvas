import { cn } from "@/lib/utils";
import type { CampaignStatus } from "@/types/campaign.types";

const STATUS_META: Record<CampaignStatus, { label: string; tone: string; dot: string }> = {
  draft: {
    label: "Rascunho",
    tone: "text-[var(--status-neutral)] bg-[var(--status-neutral-muted)]",
    dot: "bg-[var(--status-neutral)]",
  },
  configured: {
    label: "Configurada",
    tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",
    dot: "bg-[var(--accent-primary)]",
  },
  open: {
    label: "Aberta",
    tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",
    dot: "bg-[var(--accent-primary)]",
  },
  filling: {
    label: "Preenchendo",
    tone: "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",
    dot: "bg-[var(--status-warn)]",
  },
  review: {
    label: "Em Revisão",
    tone: "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",
    dot: "bg-[var(--status-warn)]",
  },
  approved: {
    label: "Aprovada",
    tone: "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",
    dot: "bg-[var(--status-ok)]",
  },
  exported: {
    label: "Exportada",
    tone: "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",
    dot: "bg-[var(--status-ok)]",
  },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const meta = STATUS_META[status];

  return (
    <span className={cn("status-pill", meta.tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
