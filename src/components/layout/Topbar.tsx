import { useRouterState } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const BREADCRUMB_MAP: Record<string, string> = {
  "/campaigns": "Campanhas",
  "/buyer-desk": "Mesa do Comprador",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  marketing: "Marketing",
  commercial: "Comercial",
  buyer: "Comprador",
  designer: "Designer",
  board: "Diretoria",
  audit: "Auditoria",
};

export function Topbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);
  const initials = (user?.name ?? "??")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const crumb = BREADCRUMB_MAP[pathname] ?? "Painel";

  return (
    <header className="sticky top-0 z-10 flex h-[56px] items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 px-6 backdrop-blur">
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-[var(--text-secondary)]">{crumb}</span>
      </nav>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
          aria-label="Notificações"
        >
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--status-critical)] px-1 font-mono text-[9px] font-medium text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--bg-overlay)] text-[11px] font-medium text-[var(--text-primary)]">
            {initials}
          </div>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-[12px] text-[var(--text-primary)]">{user?.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
              {ROLE_LABEL[user?.role ?? ""] ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
