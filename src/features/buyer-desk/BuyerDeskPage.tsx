import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  Minus,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { productService } from "@/lib/services/product.service";
import { promotionalItemsService } from "@/lib/services/promotional-items.service";
import { mockCampaigns } from "@/lib/mocks/campaigns";
import type { ProductWithCommercial, OfferType, PmzCalcResult } from "@/types/product.types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { NovoPMZCard } from "./components/NovoPMZCard";
import { LivePreviewPanel } from "./components/LivePreviewPanel";
import { MarketIntelPanel } from "./components/MarketIntelPanel";

const OFFER_TYPES: { value: OfferType; label: string }[] = [
  { value: "simple_price", label: "Preço Simples" },
  { value: "de_por", label: "DE / POR" },
  { value: "this_package", label: "Esta Embalagem" },
  { value: "take_x_pay_y", label: "Leve X Pague Y" },
  { value: "app_price", label: "Preço App" },
  { value: "combo", label: "Combo" },
  { value: "opportunity", label: "Oportunidade" },
];

const EXPOSURE_TYPES = [
  { value: "single", label: "Avulso" },
  { value: "box", label: "Box" },
  { value: "insert", label: "Encarte" },
  { value: "highlight", label: "Destaque" },
] as const;

const formSchema = z.object({
  descriptionNewspaper: z.string().min(1, "Obrigatório").max(80),
  offerType: z.enum([
    "simple_price",
    "de_por",
    "this_package",
    "take_x_pay_y",
    "app_price",
    "combo",
    "opportunity",
  ]),
  exposureType: z.enum(["single", "box", "insert", "highlight"]),
  promotionalPrice: z.coerce.number().min(0.01, "Preço inválido"),
  sellOutOn: z.boolean(),
  sellOutValue: z.coerce.number().min(0),
  sellOutAgreementNumber: z.string().optional(),
  insertValue: z.coerce.number().min(0),
  insertBoxAgreementNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function BuyerDeskPage() {
  const campaign = mockCampaigns.find((c) => c.id === "c-1")!;
  const [seq, setSeq] = useState("");
  const [loadingSeq, setLoadingSeq] = useState(false);
  const [seqError, setSeqError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductWithCommercial | null>(null);
  const [pmzResult, setPmzResult] = useState<PmzCalcResult | null>(null);
  const [intelOpen, setIntelOpen] = useState(true);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descriptionNewspaper: "",
      offerType: "simple_price",
      exposureType: "single",
      promotionalPrice: 0,
      sellOutOn: false,
      sellOutValue: 0,
      sellOutAgreementNumber: "",
      insertValue: 0,
      insertBoxAgreementNumber: "",
    },
  });

  const description = watch("descriptionNewspaper");
  const promotionalPrice = watch("promotionalPrice");
  const sellOutOn = watch("sellOutOn");
  const sellOutValue = watch("sellOutValue");
  const insertValue = watch("insertValue");
  const offerType = watch("offerType");
  const exposureType = watch("exposureType");

  const charCount = description?.length ?? 0;
  const charWarn = charCount >= 50;
  const charError = charCount >= 70;

  async function handleSeqSearch() {
    setLoadingSeq(true);
    setSeqError(null);
    try {
      const result = await productService.searchBySeq(seq);
      setProduct(result);
      setValue("descriptionNewspaper", result.product.description);
      setPmzResult(null);
    } catch (err) {
      setProduct(null);
      setPmzResult(null);
      setSeqError(err instanceof Error ? err.message : "Erro na busca.");
    } finally {
      setLoadingSeq(false);
    }
  }

  useEffect(() => {
    if (!product || !promotionalPrice) {
      setPmzResult(null);
      return;
    }
    const t = setTimeout(async () => {
      const result = await promotionalItemsService.calculatePmz({
        pmz: product.commercial.pmz,
        promotionalPrice,
        sellOutValue: sellOutOn ? sellOutValue : 0,
        insertValue,
      });
      setPmzResult(result);
    }, 250);
    return () => clearTimeout(t);
  }, [product, promotionalPrice, sellOutOn, sellOutValue, insertValue]);

  const onSubmit = async (_values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Item salvo com sucesso.");
  };

  const onSaveNext = async () => {
    await handleSubmit(onSubmit)();
    setSeq("");
    setProduct(null);
    setPmzResult(null);
    reset();
  };

  const competitive: "ok" | "warn" | "critical" | null = product
    ? promotionalPrice && product.commercial.lowestCompetitorPrice90d
      ? promotionalPrice <= product.commercial.lowestCompetitorPrice90d
        ? "ok"
        : promotionalPrice <= product.commercial.lowestCompetitorPrice90d * 1.05
        ? "warn"
        : "critical"
      : "warn"
    : null;

  return (
    <div className="space-y-6">
      {/* Context bar */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-[18px] text-[var(--text-primary)]">{campaign.name}</div>
            <div className="font-mono text-[11px] text-[var(--text-tertiary)]">{campaign.code}</div>
          </div>
          <div className="text-[13px] text-[var(--text-secondary)]">
            Slot 04 · Página 2 · Miolo
          </div>
          <div className="w-[180px] space-y-1">
            <ProgressBar value={3} max={6} />
            <div className="font-mono text-[11px] text-[var(--text-secondary)]">3 de 6 itens preenchidos</div>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--status-warn)]">
            <Clock size={13} strokeWidth={1.5} /> Prazo: 18 Jan 2025
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[58fr_42fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* SEQ search */}
          <div className="space-y-2">
            <label className="section-label">Seqproduto / Cod Prod</label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSeqSearch();
              }}
              className="relative"
            >
              <input
                value={seq}
                onChange={(e) => setSeq(e.target.value)}
                placeholder="00000000"
                className={cn(
                  "h-14 w-full rounded-lg border-2 bg-[var(--bg-canvas)] px-5 pr-44 font-mono text-[18px] text-[var(--text-primary)] transition-all",
                  seqError ? "border-[var(--status-critical)]" : "border-[var(--border-default)] focus:border-[var(--accent-primary)] focus:shadow-[var(--shadow-glow-blue)]",
                  "outline-none",
                )}
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--text-tertiary)]">Enter p/ buscar</span>
                <button
                  type="submit"
                  disabled={loadingSeq}
                  className="grid h-10 w-10 place-items-center rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
                  aria-label="Buscar"
                >
                  {loadingSeq ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} strokeWidth={1.8} />}
                </button>
              </div>
            </form>
            {seqError && (
              <p className="flex items-center gap-1.5 text-[12px] text-[var(--status-critical)]">
                <AlertCircle size={13} strokeWidth={1.5} /> {seqError}
              </p>
            )}
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Exemplo: <span className="font-mono">10000137</span> · ou tente um SEQ inválido para ver erro.
            </p>
          </div>

          {/* Product data panel */}
          {product && (
            <div className="space-y-4 animate-fade-slide-in">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ["Departamento", product.product.department],
                  ["Família", product.product.familyName],
                  ["Fornecedor", product.product.supplier],
                  ["Filial", product.commercial.filial],
                ].map(([k, v]) => (
                  <div className="data-chip" key={k}>
                    <span className="data-chip-label">{k}</span>
                    <span className="data-chip-value truncate">{v}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {[
                  ["PMZ", formatBRL(product.commercial.pmz)],
                  ["Preço Venda", formatBRL(product.commercial.salePrice)],
                  ["Estoque", `${product.commercial.stockQty} un`],
                  ["Méd. 30d", `${product.commercial.avgSales30d} un`],
                  ["Curva ABC", product.commercial.abcCurve],
                ].map(([k, v]) => (
                  <div className="data-chip" key={k}>
                    <span className="data-chip-label">{k}</span>
                    <span className="data-chip-value">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                <div>
                  <div className="text-[13px] text-[var(--text-secondary)]">{product.commercial.competitorName}</div>
                  <div className="font-mono text-[11px] text-[var(--text-tertiary)]">
                    Pesquisa em {new Date(product.commercial.competitorResearchDate).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="font-mono text-[24px] text-[var(--text-primary)]">
                  {formatBRL(product.commercial.lowestCompetitorPrice90d)}
                </div>
                <div
                  className={cn(
                    "status-pill",
                    competitive === "ok" && "text-[var(--status-ok)] bg-[var(--status-ok-muted)]",
                    competitive === "warn" && "text-[var(--status-warn)] bg-[var(--status-warn-muted)]",
                    competitive === "critical" && "text-[var(--status-critical)] bg-[var(--status-critical-muted)]",
                  )}
                >
                  {competitive === "ok" ? <TrendingDown size={12} /> : competitive === "warn" ? <Minus size={12} /> : <TrendingUp size={12} />}
                  {competitive === "ok" ? "Competitivo" : competitive === "warn" ? "Atenção" : "Não competitivo"}
                </div>
              </div>
            </div>
          )}

          {/* Buyer fill form */}
          {product && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-slide-in">
              <div className="section-label">Dados do Item</div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[var(--text-secondary)]">Descrição ERP (original)</label>
                  <input
                    value={product.product.descriptionErp}
                    readOnly
                    className="ds-input italic text-[var(--text-tertiary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[var(--text-secondary)]">Descrição Jornal</label>
                  <textarea
                    rows={2}
                    {...register("descriptionNewspaper")}
                    className="ds-input h-auto py-2"
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setValue("descriptionNewspaper", product.product.description)}
                      className="inline-flex items-center gap-1 rounded-sm bg-[var(--bg-overlay)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Sugestão: {product.product.description}
                    </button>
                    <span
                      className={cn(
                        "font-mono",
                        charError ? "text-[var(--status-critical)]" : charWarn ? "text-[var(--status-warn)]" : "text-[var(--text-tertiary)]",
                      )}
                    >
                      {charCount}/70
                    </span>
                  </div>
                  {errors.descriptionNewspaper && (
                    <p className="text-[11px] text-[var(--status-critical)]">{errors.descriptionNewspaper.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-[var(--text-secondary)]">Tipo de Oferta</label>
                <div className="flex flex-wrap gap-2">
                  {OFFER_TYPES.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setValue("offerType", o.value)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                        offerType === o.value
                          ? "bg-[var(--accent-primary)] text-white"
                          : "bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_280px]">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[var(--text-secondary)]">Preço da Oferta</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[14px] text-[var(--text-tertiary)]">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register("promotionalPrice")}
                      className="ds-input h-12 pl-10 font-mono text-[20px]"
                      placeholder="0,00"
                    />
                  </div>
                  {errors.promotionalPrice && (
                    <p className="text-[11px] text-[var(--status-critical)]">{errors.promotionalPrice.message}</p>
                  )}
                </div>

                {/* PMZ Card */}
                <NovoPMZCard result={pmzResult} />
              </div>

              {pmzResult?.status === "warn" && (
                <div className="flex items-start gap-2 rounded-md border-l-2 border-[var(--status-warn)] bg-[var(--status-warn-muted)] px-3 py-2 text-[12px] text-[var(--status-warn)]">
                  <AlertTriangle size={14} strokeWidth={1.5} className="mt-px" />
                  Margem abaixo do mínimo. Enviar para fila comercial?
                </div>
              )}
              {pmzResult?.status === "critical" && (
                <div className="flex items-start gap-2 rounded-md border-l-2 border-[var(--status-critical)] bg-[var(--status-critical-muted)] px-3 py-2 text-[12px] text-[var(--status-critical)]">
                  <AlertOctagon size={14} strokeWidth={1.5} className="mt-px" />
                  Margem negativa. Aprovação comercial obrigatória.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[12px] text-[var(--text-secondary)]">Tipo de Exposição</label>
                <div className="flex flex-wrap gap-2">
                  {EXPOSURE_TYPES.map((e) => (
                    <button
                      key={e.value}
                      type="button"
                      onClick={() => setValue("exposureType", e.value)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                        exposureType === e.value
                          ? "bg-[var(--accent-primary)] text-white"
                          : "bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                  <label className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
                    Sell Out
                    <input
                      type="checkbox"
                      {...register("sellOutOn")}
                      className="h-4 w-4 accent-[var(--accent-primary)]"
                    />
                  </label>
                  {sellOutOn && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register("sellOutValue")}
                        placeholder="Valor"
                        className="ds-input h-9 font-mono text-[13px]"
                      />
                      <input
                        type="text"
                        {...register("sellOutAgreementNumber")}
                        placeholder="N° Acordo"
                        className="ds-input h-9 text-[13px]"
                      />
                    </div>
                  )}
                </div>
                <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                  <label className="block text-[12px] text-[var(--text-secondary)]">Valor Encarte / Box</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      {...register("insertValue")}
                      placeholder="Valor"
                      className="ds-input h-9 font-mono text-[13px]"
                    />
                    <input
                      type="text"
                      {...register("insertBoxAgreementNumber")}
                      placeholder="N° Acordo"
                      className="ds-input h-9 text-[13px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} strokeWidth={1.5} />}
                  Salvar Item
                </button>
                <button
                  type="button"
                  onClick={onSaveNext}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border-default)] px-4 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]"
                >
                  Salvar e Próximo <ArrowRight size={14} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setProduct(null);
                    setSeq("");
                    setPmzResult(null);
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-md px-4 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X size={14} strokeWidth={1.5} /> Limpar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="section-label">Preview do Slot</span>
              <RefreshCw size={13} strokeWidth={1.5} className="text-[var(--text-tertiary)]" />
            </div>
            <div className="mt-3 rounded-lg border border-[var(--border-default)] bg-white p-6">
              <div className="grid h-48 w-full place-items-center rounded border border-dashed border-neutral-300 text-neutral-400">
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus size={28} strokeWidth={1.2} />
                  <span className="text-[12px]">Sem imagem</span>
                </div>
              </div>
              <div className="mt-4 text-[16px] text-neutral-900">
                {description || product?.product.description || "Produto"}
              </div>
              <div className="mt-1 font-mono text-[28px] font-bold text-neutral-900">
                {promotionalPrice ? formatBRL(promotionalPrice) : "R$ —"}
              </div>
              {offerType === "de_por" && product && (
                <div className="font-mono text-[12px] text-neutral-500 line-through">
                  De {formatBRL(product.commercial.salePrice)}
                </div>
              )}
            </div>
            {charError && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--status-critical-muted)] px-2 py-1 text-[11px] text-[var(--status-critical)]">
                <AlertCircle size={12} /> Texto estourado
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
            <button
              type="button"
              onClick={() => setIntelOpen((v) => !v)}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="section-label">Inteligência de Mercado</span>
              {intelOpen ? <ChevronUp size={14} className="text-[var(--text-tertiary)]" /> : <ChevronDown size={14} className="text-[var(--text-tertiary)]" />}
            </button>
            {intelOpen && product && (
              <div className="space-y-4 px-4 pb-4">
                <div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">Curva ABC</div>
                  <div className="flex h-2 overflow-hidden rounded-full">
                    <div className={cn("flex-1", product.commercial.abcCurve === "A" ? "bg-[var(--status-ok)]" : "bg-[var(--bg-overlay)]")} />
                    <div className={cn("flex-1", product.commercial.abcCurve === "B" ? "bg-[var(--status-warn)]" : "bg-[var(--bg-overlay)]")} />
                    <div className={cn("flex-1", product.commercial.abcCurve === "C" ? "bg-[var(--status-critical)]" : "bg-[var(--bg-overlay)]")} />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">Estoque por loja</div>
                  <div className="space-y-1.5">
                    {["BH Centro", "Caeté", "Nazaré"].map((l, i) => (
                      <div key={l} className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-[var(--text-secondary)]">{l}</span>
                        <div className="flex-1">
                          <ProgressBar value={[80, 50, 25][i]} max={100} tone={i === 2 ? "warn" : "accent"} />
                        </div>
                        <span className="font-mono text-[var(--text-primary)]">{[480, 320, 180][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">Histórico promocional</div>
                  <div className="space-y-1.5">
                    {["FQ-2024-25", "FQ-2024-22", "FQ-2024-18"].map((c, i) => (
                      <div key={c} className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[var(--text-secondary)]">{c}</span>
                        <span className={cn(
                          "status-pill",
                          i === 0 ? "text-[var(--status-ok)] bg-[var(--status-ok-muted)]"
                          : i === 1 ? "text-[var(--status-warn)] bg-[var(--status-warn-muted)]"
                          : "text-[var(--status-critical)] bg-[var(--status-critical-muted)]",
                        )}>
                          {["Bom", "Regular", "Baixo"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="status-pill text-[var(--status-warn)] bg-[var(--status-warn-muted)]">
                    <AlertTriangle size={11} /> Risco de Ruptura · Médio
                  </span>
                  <span className="status-pill text-[var(--status-neutral)] bg-[#64748b22]">
                    Baixa Expressividade · Baixo
                  </span>
                </div>
              </div>
            )}
            {intelOpen && !product && (
              <div className="px-4 pb-4 text-[12px] text-[var(--text-tertiary)]">
                Busque um SEQPRODUTO para ver inteligência de mercado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
