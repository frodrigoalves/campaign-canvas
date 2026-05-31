import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  Copy,
  Edit2,
  Eye,
  Inbox,
  Layers,
  Plus,
  Search,
  ShoppingBag,
  Timer,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge, CampaignTypeBadge } from "./StatusBadge";
import { campaignService } from "@/lib/services/campaign.service";
import { mockCampaigns } from "@/lib/mocks/campaigns";
import type { CampaignStatus, CampaignType } from "@/types/campaign.types";

export const campaignsQueryKey = (params: {
  search?: string;
  type?: CampaignType | "all";
  status?: CampaignStatus | "all";
  page?: number;
}) => ["campaigns", params] as const;

export const campaignsQueryOptions = (params: {
  search?: string;
  type?: CampaignType | "all";
  status?: CampaignStatus | "all";
  page?: number;
}) => ({
  queryKey: campaignsQueryKey(params),
  queryFn: () => campaignService.list(params),
});

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function CampaignsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<CampaignType | "all">("all");
  const [status, setStatus] = useState<CampaignStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data } = useSuspenseQuery(campaignsQueryOptions({ search, type, status, page }));

  const stats = useMemo(() => {
    const active = mockCampaigns.filter((c) =>
      ["open", "filling", "review", "configured"].includes(c.status),
    ).length;
    const filling = mockCampaigns.filter((c) => c.status === "filling").length;
    const awaiting = mockCampaigns.filter((c) => c.status === "review").length;
    const exported = mockCampaigns.filter((c) => c.status === "exported").length;
    return { active, filling, awaiting, exported };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        subtitle="Gerencie campanhas promocionais, folhetos e peças digitais."
        actions={
          <button
            type="button"
            onClick={() => toast.info("Wizard de criação chega no próximo passo.")}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Plus size={15} strokeWidth={1.8} />
            Nova Campanha
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Campanhas Ativas" value={stats.active} icon={Layers} tone="accent" hint="Em andamento agora" />
        <MetricCard label="Em Preenchimento" value={stats.filling} icon={Timer} tone="warn" hint="Compradores trabalhando" />
        <MetricCard label="Aguardando Aprovação" value={stats.awaiting} icon={AlertCircle} tone="critical" hint="Bloqueando exporte" />
        <MetricCard label="Exportadas no mês" value={stats.exported} icon={ShoppingBag} tone="ok" hint="Concluídas com sucesso" />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
        <div className="relative w-full max-w-[320px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome ou código..."
            className="ds-input h-[38px] pl-9 text-[13px]"
          />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as CampaignType | "all");
            setPage(1);
          }}
          className="ds-input h-[38px] w-auto min-w-[180px] text-[13px]"
        >
          <option value="all">Todos os tipos</option>
          <option value="promotional_print">Folheto</option>
          <option value="commercial">Comercial</option>
          <option value="seasonal">Sazonal</option>
          <option value="opportunity">Oportunidade</option>
          <option value="stock">Estoque</option>
          <option value="regional">Regional</option>
          <option value="digital">Digital</option>
          <option value="only_app">Só App</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as CampaignStatus | "all");
            setPage(1);
          }}
          className="ds-input h-[38px] w-auto min-w-[180px] text-[13px]"
        >
          <option value="all">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="configured">Configurada</option>
          <option value="open">Aberta</option>
          <option value="filling">Preenchendo</option>
          <option value="review">Em Revisão</option>
          <option value="approved">Aprovada</option>
          <option value="exported">Exportada</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        {data.data.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nenhuma campanha encontrada"
            description="Ajuste seus filtros ou crie uma nova campanha promocional."
          />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-widest text-[var(--text-tertiary)]">
                <th className="px-5 py-3 font-medium">Campanha</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Período</th>
                <th className="px-5 py-3 font-medium">Progresso</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Prazo</th>
                <th className="px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((c) => {
                const deadline = new Date(c.deadlines.export);
                const overdue = deadline.getTime() < Date.now() && c.status !== "exported";
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      if (c.id === "c-1") navigate({ to: "/buyer-desk" });
                      else toast.info("Detalhe da campanha estará disponível em breve.");
                    }}
                    className="h-14 cursor-pointer border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--bg-overlay)]"
                  >
                    <td className="px-5">
                      <div className="text-[14px] text-[var(--text-primary)]">{c.name}</div>
                      <div className="font-mono text-[11px] text-[var(--text-tertiary)]">{c.code}</div>
                    </td>
                    <td className="px-5">
                      <CampaignTypeBadge type={c.type} />
                    </td>
                    <td className="px-5 text-[13px] text-[var(--text-secondary)]">
                      {formatDateShort(c.startDate)} – {formatDateShort(c.endDate)}
                    </td>
                    <td className="px-5">
                      <div className="w-[160px] space-y-1.5">
                        <ProgressBar value={c.filledSlots} max={c.totalSlots} />
                        <div className="font-mono text-[11px] text-[var(--text-secondary)]">
                          {c.filledSlots}/{c.totalSlots} slots
                        </div>
                      </div>
                    </td>
                    <td className="px-5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5">
                      <div
                        className={`inline-flex items-center gap-1.5 font-mono text-[12px] ${
                          overdue ? "text-[var(--status-critical)]" : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {overdue ? <AlertCircle size={13} strokeWidth={1.5} /> : <Clock size={13} strokeWidth={1.5} />}
                        {formatDateShort(c.deadlines.export)}
                      </div>
                    </td>
                    <td className="px-5">
                      <div className="flex items-center justify-end gap-1 text-[var(--text-tertiary)]">
                        {[Eye, Edit2, Copy, MoreHorizontal].map((Icon, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info("Em breve.");
                            }}
                            className="grid h-8 w-8 place-items-center rounded transition-colors hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
                          >
                            <Icon size={15} strokeWidth={1.5} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {data.data.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3 text-[13px] text-[var(--text-secondary)]">
            <span>
              Mostrando {(data.meta.page - 1) * data.meta.pageSize + 1}–
              {Math.min(data.meta.total, data.meta.page * data.meta.pageSize)} de {data.meta.total} campanhas
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[var(--border-default)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                className="rounded-md border border-[var(--border-default)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
