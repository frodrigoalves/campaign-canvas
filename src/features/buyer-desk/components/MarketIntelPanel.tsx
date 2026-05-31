import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { ProductWithCommercial } from "@/types/product.types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

interface MarketIntelPanelProps {
  product: ProductWithCommercial | null;
}

export function MarketIntelPanel({ product }: MarketIntelPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="section-label">Inteligência de Mercado</span>
        {open ? (
          <ChevronUp size={14} className="text-[var(--text-tertiary)]" />
        ) : (
          <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
        )}
      </button>
      {open && product && (
        <div className="space-y-4 px-4 pb-4">
          <div>
            <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">Curva ABC</div>
            <div className="flex h-2 overflow-hidden rounded-full">
              <div
                className={cn(
                  "flex-1",
                  product.commercial.abcCurve === "A"
                    ? "bg-[var(--status-ok)]"
                    : "bg-[var(--bg-overlay)]",
                )}
              />
              <div
                className={cn(
                  "flex-1",
                  product.commercial.abcCurve === "B"
                    ? "bg-[var(--status-warn)]"
                    : "bg-[var(--bg-overlay)]",
                )}
              />
              <div
                className={cn(
                  "flex-1",
                  product.commercial.abcCurve === "C"
                    ? "bg-[var(--status-critical)]"
                    : "bg-[var(--bg-overlay)]",
                )}
              />
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">Estoque por loja</div>
            <div className="space-y-1.5">
              {["BH Centro", "Caeté", "Nazaré"].map((l, i) => (
                <div key={l} className="flex items-center gap-2 text-[11px]">
                  <span className="w-20 text-[var(--text-secondary)]">{l}</span>
                  <div className="flex-1">
                    <ProgressBar
                      value={[80, 50, 25][i]}
                      max={100}
                      tone={i === 2 ? "warn" : "accent"}
                    />
                  </div>
                  <span className="font-mono text-[var(--text-primary)]">
                    {[480, 320, 180][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-tertiary)] mb-1.5">
              Histórico promocional
            </div>
            <div className="space-y-1.5">
              {["FQ-2024-25", "FQ-2024-22", "FQ-2024-18"].map((c, i) => (
                <div key={c} className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[var(--text-secondary)]">{c}</span>
                  <span
                    className={cn(
                      "status-pill",
                      i === 0
                        ? "text-[var(--status-ok)] bg-[var(--status-ok-muted)]"
                        : i === 1
                        ? "text-[var(--status-warn)] bg-[var(--status-warn-muted)]"
                        : "text-[var(--status-critical)] bg-[var(--status-critical-muted)]",
                    )}
                  >
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
      {open && !product && (
        <div className="px-4 pb-4 text-[12px] text-[var(--text-tertiary)]">
          Busque um SEQPRODUTO para ver inteligência de mercado.
        </div>
      )}
    </div>
  );
}
