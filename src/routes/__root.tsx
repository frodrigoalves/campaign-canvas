import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Outlet as RouterOutlet,
} from "@tanstack/react-router";
import "@/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <TooltipProvider delayDuration={0}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterOutlet />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </QueryClientProvider>
      </TooltipProvider>
      <Scripts />
    </>
  );
}
