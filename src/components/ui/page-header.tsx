import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex items-end justify-between gap-6 pb-6", className)}>
      <div className="space-y-2">
        <h1 className="font-display text-[32px] leading-[1.1] text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[var(--text-secondary)] max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
