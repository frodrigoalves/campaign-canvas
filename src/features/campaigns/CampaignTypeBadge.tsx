import type { CampaignType } from "@/types/campaign.types";

const TYPE_META: Record<CampaignType, { label: string; tone: string; dot: string }> = {
  promotional_print: {
    label: "Folheto",
    tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",
    dot: "bg-[var(--accent-primary)]",
  },
  commercial: {
    label: "Comercial",
    tone: "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",
    dot: "bg-[var(--status-ok)]",
  },
  seasonal: {
    label: "Sazonal",
    tone: "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",
    dot: "bg-[var(--status-warn)]",
  },
  opportunity: {
    label: "Oportunidade",
    tone: "text-[var(--status-critical)] bg-[var(--status-critical-muted)]",
    dot: "bg-[var(--status-critical)]",
  },
  stock: {
    label: "Estoque",
    tone: "text-[var(--text-secondary)] bg-[var(--status-neutral)]/10",
    dot: "bg-[var(--status-neutral)]",
  },
  regional: {
    label: "Regional",
    tone: "text-[var(--text-primary)] bg-[var(--bg-overlay)]",
    dot: "bg-[var(--text-tertiary)]",
  },
  digital: {
    label: "Digital",
    tone: "text-[var(--text-primary)] bg-[var(--bg-raised)]",
    dot: "bg-[var(--accent-primary)]",
  },
  only_app: {
    label: "Só App",
    tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",
    dot: "bg-[var(--accent-primary)]",
  },
};

export function CampaignTypeBadge({ type }: { type: CampaignType }) {
  const meta = TYPE_META[type];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${meta.tone}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
