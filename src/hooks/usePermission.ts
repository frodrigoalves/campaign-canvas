import { useAuthStore } from "@/lib/auth-store";
import { hasPermission } from "@/lib/permissions";

export function usePermission() {
  const role = useAuthStore((s) => s.user?.role);
  return { can: (action: string) => hasPermission(role, action), role };
}
