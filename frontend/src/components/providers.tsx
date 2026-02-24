"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { api } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    // ❌ Do NOT refresh on login
    if (pathname === "/login") return;

    // ❌ Do NOT refresh if we already have access token
    if (accessToken) return;

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
  }, [pathname, accessToken, setAccessToken]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
