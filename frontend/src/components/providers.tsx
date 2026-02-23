"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { api } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { setAccessToken, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // When the page refreshes, we immediately try to get a new Access Token
        // using the HttpOnly Refresh Cookie that stays in the browser.
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
      } catch (err) {
        // If refresh fails (cookie expired or missing), we log out
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAccessToken, logout]);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
