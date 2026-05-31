import { cn } from "@/lib/utils";

interface StatusDotProps {
  tone?: "ok" | "warn" | "critical" | "neutral" | "accent";
  className?: string;
}

const TONE: Record<NonNullable<StatusDotProps["tone"]>, string> = {
  ok: "bg-[var(--status-ok)]",
  warn: "bg-[var(--status-warn)]",
  critical: "bg-[var(--status-critical)]",
  neutral: "bg-[var(--status-neutral)]",
  accent: "bg-[var(--accent-primary)]",
};

export function StatusDot({ tone = "neutral", className }: StatusDotProps) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", TONE[tone], className)} />;
}
