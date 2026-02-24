"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  // Wait for Zustand hydration
  if (!hasHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // After hydration, if no token — layout will redirect
  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
