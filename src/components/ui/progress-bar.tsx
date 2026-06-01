import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  tone?: "accent" | "ok" | "warn" | "critical";
}

const TONE: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  accent: "bg-[var(--accent-primary)]",
  ok: "bg-[var(--status-ok)]",
  warn: "bg-[var(--status-warn)]",
  critical: "bg-[var(--status-critical)]",
};

export function ProgressBar({ value, max = 100, tone = "accent", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / Math.max(1, max)) * 100));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-canvas)]", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width]", TONE[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
