import type { UserRole } from "@/types/user.types";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["*"],
  marketing: [
    "campaigns.create",
    "campaigns.edit",
    "campaigns.release",
    "campaigns.view",
    "editorial.manage",
    "alerts.view",
    "preview.view",
  ],
  commercial: [
    "campaigns.view",
    "commercial.validate",
    "margin.approve",
    "buyers.monitor",
    "dashboards.view",
  ],
  buyer: [
    "campaigns.view_own",
    "slots.view_own",
    "items.fill",
    "items.edit_own",
    "preview.view",
    "buyer_desk.use",
  ],
  designer: ["canvas.edit", "images.manage", "versions.save", "layout.adjust"],
  board: ["dashboards.view", "campaigns.approve_final"],
  audit: ["logs.view", "sessions.view", "events.view"],
};

export function hasPermission(role: UserRole | undefined, action: string): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.includes(action);
}
