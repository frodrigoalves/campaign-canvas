import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/auth-store";
import { LoginPage } from "@/features/auth/LoginPage";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: search.redirect ?? "/campaigns" });
    }
  },
  head: () => ({ meta: [{ title: "Entrar — Cevaroli" }] }),
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect: redirectTo } = Route.useSearch();
  return <LoginPage redirectTo={redirectTo} />;
}
