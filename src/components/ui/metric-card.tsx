import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "ok" | "warn" | "critical" | "accent";
  icon?: LucideIcon;
}

const TONE_TEXT: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "text-[var(--text-primary)]",
  ok: "text-[var(--status-ok)]",
  warn: "text-[var(--status-warn)]",
  critical: "text-[var(--status-critical)]",
  accent: "text-[var(--accent-primary)]",
};

export function MetricCard({ label, value, hint, tone = "neutral", icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--border-default)]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)] font-medium">{label}</span>
        {Icon && <Icon size={16} strokeWidth={1.5} className="text-[var(--text-tertiary)]" />}
      </div>
      <div className={cn("mt-3 font-mono text-[34px] leading-none font-medium", TONE_TEXT[tone])}>
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-[var(--text-tertiary)]">{hint}</div>}
    </div>
  );
}
