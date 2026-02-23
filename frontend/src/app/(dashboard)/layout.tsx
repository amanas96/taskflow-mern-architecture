"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  if (!isMounted || !accessToken) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
