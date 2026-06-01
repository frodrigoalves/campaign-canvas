import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "default" | "active" | "warn" | "critical" | "ok";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<ChipVariant, string> = {
  default: "bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border-default)]",
  active: "bg-[var(--accent-primary)] text-white border border-transparent",
  warn: "bg-[var(--status-warn-muted)] text-[var(--status-warn)] border border-[var(--status-warn)]",
  critical: "bg-[var(--status-critical-muted)] text-[var(--status-critical)] border border-[var(--status-critical)]",
  ok: "bg-[var(--status-ok-muted)] text-[var(--status-ok)] border border-[var(--status-ok)]",
};

export function Chip({ variant = "default", className, children, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
