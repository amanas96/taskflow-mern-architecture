"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { api } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    // 🚨 DO NOT refresh on login page
    if (pathname === "/login") return;

    api
      .post("/auth/refresh")
      .then((res) => {
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
        }
      })
      .catch(() => {
        // ignore 401 silently
      });
  }, [pathname, setAccessToken]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
