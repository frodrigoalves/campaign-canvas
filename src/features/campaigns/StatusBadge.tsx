import { cn } from "@/lib/utils";
import type { CampaignStatus, CampaignType } from "@/types/campaign.types";

const STATUS_META: Record<CampaignStatus, { label: string; tone: string; dot: string }> = {
  draft:      { label: "Rascunho",    tone: "text-[var(--status-neutral)] bg-[#64748b22]",                 dot: "bg-[var(--status-neutral)]" },
  configured: { label: "Configurada", tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",       dot: "bg-[var(--accent-primary)]" },
  open:       { label: "Aberta",      tone: "text-[var(--accent-primary)] bg-[var(--accent-muted)]",       dot: "bg-[var(--accent-primary)]" },
  filling:    { label: "Preenchendo", tone: "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",     dot: "bg-[var(--status-warn)]" },
  review:     { label: "Em Revisão",  tone: "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",     dot: "bg-[var(--status-warn)]" },
  approved:   { label: "Aprovada",    tone: "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",         dot: "bg-[var(--status-ok)]" },
  exported:   { label: "Exportada",   tone: "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",         dot: "bg-[var(--status-ok)]" },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("status-pill", m.tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

const TYPE_LABEL: Record<CampaignType, string> = {
  promotional_print: "Folheto",
  commercial: "Comercial",
  seasonal: "Sazonal",
  opportunity: "Oportunidade",
  stock: "Estoque",
  regional: "Regional",
  digital: "Digital",
  only_app: "Só App",
};

export function CampaignTypeBadge({ type }: { type: CampaignType }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-tertiary)]" />
      {TYPE_LABEL[type]}
    </span>
  );
}
