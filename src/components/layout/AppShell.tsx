import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-canvas)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
      <Toaster richColors />
    </div>
  );
}
