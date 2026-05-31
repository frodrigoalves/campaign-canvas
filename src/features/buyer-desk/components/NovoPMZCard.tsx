import { RefreshCw } from "lucide-react";
import type { PmzCalcResult } from "@/types/product.types";
import { cn } from "@/lib/utils";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface NovoPMZCardProps {
  result: PmzCalcResult | null;
}

export function NovoPMZCard({ result }: NovoPMZCardProps) {
  const toneClass =
    result?.status === "ok"
      ? "text-[var(--status-ok)]"
      : result?.status === "warn"
      ? "text-[var(--status-warn)]"
      : result?.status === "critical"
      ? "text-[var(--status-critical)]"
      : "text-[var(--text-tertiary)]";

  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-canvas)] p-3">
      <div className="flex items-start justify-between">
        <div className="section-label">Novo PMZ</div>
        <RefreshCw size={13} strokeWidth={1.5} className="text-[var(--text-tertiary)]" />
      </div>
      <div className={cn("mt-1 font-mono text-[22px] font-medium", toneClass)}>
        {result ? formatBRL(result.novoPmz) : "—"}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
          Margem Oferta
        </span>
        <span className={cn("font-mono text-[12px]", toneClass)}>
          {result ? `${result.marginPercent.toFixed(1)}%` : "—"}
        </span>
      </div>
    </div>
  );
}
