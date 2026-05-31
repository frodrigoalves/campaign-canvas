import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  CheckSquare,
  Eye,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  LogOut,
  Send,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  permission?: string;
  comingSoon?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Operacional",
    items: [
      { label: "Campanhas", icon: LayoutGrid, to: "/campaigns", permission: "campaigns.view" },
      { label: "Compradores", icon: Users, permission: "buyers.monitor", comingSoon: true },
      { label: "Estrutura Editorial", icon: Layers, permission: "editorial.manage", comingSoon: true },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { label: "Mesa do Comprador", icon: ShoppingBag, to: "/buyer-desk", permission: "buyer_desk.use" },
      { label: "Banco de Imagens", icon: ImageIcon, permission: "images.manage", comingSoon: true },
      { label: "Preview", icon: Eye, permission: "preview.view", comingSoon: true },
    ],
  },
  {
    label: "Aprovações",
    items: [
      { label: "Aprovações", icon: CheckSquare, permission: "campaigns.approve_final", comingSoon: true },
      { label: "Exportação", icon: Send, permission: "campaigns.release", comingSoon: true },
    ],
  },
  {
    label: "Gestão",
    items: [
      { label: "Dashboard", icon: BarChart2, permission: "dashboards.view", comingSoon: true },
      { label: "Administração", icon: Settings, permission: "*", comingSoon: true },
    ],
  },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const { can } = usePermission();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const visibleNav = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || item.permission === "*" || can(item.permission)),
  })).filter((group) => group.items.length > 0);

  const initials = (user?.name ?? "??")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    clear();
    router.navigate({ to: "/login" });
  };

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="px-5 pt-6 pb-4">
        <div className="font-display text-[20px] leading-none text-[var(--text-primary)]">
          CEVAROLI
        </div>
        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
          Inteligência Promocional
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.label} className="mt-6 first:mt-2">
            <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.15em] text-[var(--text-tertiary)] font-medium">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.to ? pathname === item.to || pathname.startsWith(item.to + "/") : false;
                const baseClasses =
                  "group flex items-center gap-2.5 h-[38px] px-3 rounded-md text-[13px] transition-colors";
                if (item.comingSoon || !item.to) {
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => toast.info(`${item.label} estará disponível em breve.`)}
                        className={cn(baseClasses, "w-full text-left text-[var(--text-tertiary)] hover:bg-[var(--bg-overlay)]/40")}
                      >
                        <item.icon size={16} strokeWidth={1.5} />
                        <span className="flex-1">{item.label}</span>
                        <span className="rounded-sm bg-[var(--bg-overlay)] px-1.5 py-px text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">
                          em breve
                        </span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={cn(
                        baseClasses,
                        isActive
                          ? "bg-[var(--accent-muted)] text-[var(--accent-primary)] relative before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:rounded-r before:bg-[var(--accent-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      <item.icon size={16} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border-subtle)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--bg-overlay)] text-[12px] font-medium text-[var(--text-primary)]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-[var(--text-primary)]">
              {user?.name ?? "—"}
            </div>
            <div className="truncate text-[11px] text-[var(--text-tertiary)]">
              {user?.email ?? ""}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="grid h-8 w-8 place-items-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
            aria-label="Sair"
          >
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
