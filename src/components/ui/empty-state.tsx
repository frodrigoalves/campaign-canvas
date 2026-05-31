import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <Icon size={44} strokeWidth={1} className="text-[var(--text-tertiary)]" />
      <h3 className="mt-5 font-display text-[22px] leading-tight text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
