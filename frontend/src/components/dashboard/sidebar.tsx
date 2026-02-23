"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { LayoutDashboard, CheckCircle2, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 border-r bg-slate-50/50 h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="font-bold text-xl">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-2 mt-4">
        <Link
          href="/tasks"
          className="flex items-center gap-3 px-3 py-2 bg-white rounded-md shadow-sm border text-sm font-medium"
        >
          <CheckCircle2 className="h-4 w-4" /> Tasks
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground"
        >
          <LayoutDashboard className="h-4 w-4" /> Insights
        </Button>
      </nav>

      <div className="border-t pt-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
