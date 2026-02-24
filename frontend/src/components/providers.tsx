"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { api } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasHydrated, setAccessToken } = useAuthStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (!hasHydrated) return;
    if (pathname === "/login") return;

    api
      .post("/auth/refresh")
      .then((res) => {
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
        }
      })
      .catch(() => {
        // silently ignore
      });
  }, [pathname, hasHydrated, setAccessToken]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
