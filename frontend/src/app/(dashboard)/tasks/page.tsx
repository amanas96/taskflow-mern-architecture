"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskFilters } from "@/components/tasks/task-filters";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";

export default function TasksPage() {
  const searchParams = useSearchParams();

  // Extract filters from URL params
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", { page, status, search }],
    queryFn: async () => {
      const res = await api.get("/tasks", {
        params: { page, status, search, limit: 10 },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workspace</h1>
          <p className="text-muted-foreground">
            Manage and track your daily operations.
          </p>
        </div>
        <CreateTaskModal />
      </div>

      <hr className="border-slate-200" />

      {/* 2. FILTERS SECTION */}
      <TaskFilters />

      {/* 3. DATA SECTION (Handling Loading/Error/Success) */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg bg-slate-50">
          <p className="text-destructive font-medium">Error loading tasks.</p>
          <p className="text-sm text-muted-foreground">
            Please check your backend connection.
          </p>
        </div>
      ) : (
        <TaskTable
          tasks={data?.tasks || []}
          pagination={
            data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
          }
        />
      )}
    </div>
  );
}
