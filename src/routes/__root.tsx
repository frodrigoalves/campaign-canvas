import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet as RouterOutlet } from "@tanstack/react-router";
import "@/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterOutlet />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
