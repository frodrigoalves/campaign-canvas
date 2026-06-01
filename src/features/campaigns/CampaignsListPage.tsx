import { type ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  Copy,
  Edit2,
  Eye,
  Inbox,
  Layers,
  Lock,
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
import { StatusBadge } from "./StatusBadge";
import { CampaignTypeBadge } from "./CampaignTypeBadge";
import { campaignService } from "@/lib/services/campaign.service";
import { mockCampaigns } from "@/lib/mocks/campaigns";
import type { Campaign, CampaignStatus, CampaignType } from "@/types/campaign.types";
import { z } from "zod";

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

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function CampaignsListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = Object.fromEntries(new URLSearchParams(location.search).entries());
  const parsed = searchSchema.parse(params);
  const search = parsed.search ?? "";
  const type = parsed.type ?? "all";
  const status = parsed.status ?? "all";
  const page = parsed.page;

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

  const updateSearch = (
    updates: Partial<{ search: string; type: string; status: string; page: number }>,
  ) => {
    const next = new URLSearchParams(location.search);
    if (updates.search !== undefined) next.set("search", updates.search);
    if (updates.type !== undefined) next.set("type", updates.type);
    if (updates.status !== undefined) next.set("status", updates.status);
    if (updates.page !== undefined) next.set("page", String(updates.page));
    navigate({ to: "/campaigns", search: Object.fromEntries(next.entries()) });
  };

  const columns: Array<{
    header: string;
    cell: (campaign: Campaign) => React.ReactNode;
  }> = [
    {
      header: "Campanha",
      cell: (campaign) => (
        <div>
          <div className="text-[14px] text-[var(--text-primary)]">{campaign.name}</div>
          <div className="font-mono text-[11px] text-[var(--text-tertiary)]">{campaign.code}</div>
        </div>
      ),
    },
    {
      header: "Tipo",
      cell: (campaign) => <CampaignTypeBadge type={campaign.type} />,
    },
    {
      header: "Período",
      cell: (campaign) => (
        <div className="text-[13px] text-[var(--text-secondary)]">
          {formatDateShort(campaign.startDate)} – {formatDateShort(campaign.endDate)}
        </div>
      ),
    },
    {
      header: "Progresso",
      cell: (campaign) => (
        <div className="w-[160px] space-y-1.5">
          <ProgressBar value={campaign.filledSlots} max={campaign.totalSlots} />
          <div className="font-mono text-[11px] text-[var(--text-secondary)]">
            {campaign.filledSlots}/{campaign.totalSlots} slots
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (campaign) => <StatusBadge status={campaign.status} />,
    },
    {
      header: "Prazo",
      cell: (campaign) => {
        const deadline = new Date(campaign.deadlines.export);
        const overdue = deadline.getTime() < Date.now() && campaign.status !== "exported";
        return (
          <div
            className={`inline-flex items-center gap-1.5 font-mono text-[12px] ${overdue ? "text-[var(--status-critical)]" : "text-[var(--text-secondary)]"}`}
          >
            {overdue ? (
              <AlertCircle size={13} strokeWidth={1.5} />
            ) : (
              <Clock size={13} strokeWidth={1.5} />
            )}
            {formatDateShort(campaign.deadlines.export)}
          </div>
        );
      },
    },
    {
      header: "Ações",
      cell: (campaign) => (
        <div className="flex items-center justify-end gap-1 text-[var(--text-tertiary)]">
          {[Eye, Edit2, Copy, MoreHorizontal].map((Icon, i) => (
            <button
              key={i}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toast.info("Em breve.");
              }}
              className="grid h-8 w-8 place-items-center rounded transition-colors hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
            >
              <Icon size={15} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        subtitle="Gerencie campanhas promocionais, folhetos e peças digitais."
        actions={
          <button
            type="button"
            disabled
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--bg-overlay)] px-4 text-[13px] font-medium text-[var(--text-secondary)] transition-colors cursor-not-allowed"
          >
            <Lock size={15} strokeWidth={1.8} />
            Nova Campanha
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Campanhas Ativas"
          value={stats.active}
          icon={Layers}
          tone="accent"
          hint="Em andamento agora"
        />
        <MetricCard
          label="Em Preenchimento"
          value={stats.filling}
          icon={Timer}
          tone="warn"
          hint="Compradores trabalhando"
        />
        <MetricCard
          label="Aguardando Aprovação"
          value={stats.awaiting}
          icon={AlertCircle}
          tone="critical"
          hint="Bloqueando exporte"
        />
        <MetricCard
          label="Exportadas no mês"
          value={stats.exported}
          icon={ShoppingBag}
          tone="ok"
          hint="Concluídas com sucesso"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
        <div className="relative w-full max-w-[320px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            value={search}
            onChange={(event) => updateSearch({ search: event.target.value, page: 1 })}
            placeholder="Buscar por nome ou código..."
            className="ds-input h-[38px] pl-9 text-[13px]"
          />
        </div>
        <select
          value={type}
          onChange={(event) => updateSearch({ type: event.target.value, page: 1 })}
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
          onChange={(event) => updateSearch({ status: event.target.value, page: 1 })}
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
                {columns.map((column) => (
                  <th key={column.header} className="px-5 py-3 font-medium">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => {
                    if (campaign.id === "c-1") {
                      navigate({ to: "/buyer-desk" });
                    } else {
                      toast.info("Detalhe da campanha estará disponível em breve.");
                    }
                  }}
                  className="h-14 cursor-pointer border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--bg-overlay)]"
                >
                  {columns.map((column) => (
                    <td key={column.header} className="px-5 py-4 align-top">
                      {column.cell(campaign)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data.data.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3 text-[13px] text-[var(--text-secondary)]">
            <span>
              Mostrando {(data.meta.page - 1) * data.meta.pageSize + 1}–
              {Math.min(data.meta.total, data.meta.page * data.meta.pageSize)} de {data.meta.total}{" "}
              campanhas
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateSearch({ page: page - 1 })}
                className="rounded-md border border-[var(--border-default)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= data.meta.totalPages}
                onClick={() => updateSearch({ page: page + 1 })}
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
