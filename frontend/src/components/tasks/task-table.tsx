"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TaskTableProps {
  tasks: any[];
  pagination: PaginationData;
}

export function TaskTable({ tasks, pagination }: TaskTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  // ✅ Must match the queryKey in page.tsx exactly
  const queryKey = ["tasks", { page, status, search }];

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // ================================
  // DELETE MUTATION (OPTIMISTIC)
  // ================================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const newTotal = (old.pagination?.total ?? 0) - 1;
        const limit = old.pagination?.limit ?? 10;

        return {
          ...old,
          tasks: old.tasks.filter((t: any) => t.id !== id),
          pagination: {
            ...old.pagination,
            total: newTotal,
            totalPages: Math.max(Math.ceil(newTotal / limit), 1),
          },
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error("Failed to delete task");
    },

    onSuccess: () => toast.success("Task deleted successfully"),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
  });

  // ================================
  // STATUS TOGGLE MUTATION (OPTIMISTIC)
  // ================================
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/tasks/${id}`, { status }),

    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t: any) =>
            t.id === id ? { ...t, status: newStatus } : t,
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error("Failed to update status");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
    },
  });

  // ✅ Safe totalPages — never NaN or 0
  const totalPages = Math.max(Number(pagination?.totalPages) || 1, 1);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No tasks found. Try adjusting your filters or add a new task.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const isCompleted = task.status === "DONE";

                // ✅ Per-task loading checks using mutation variables
                const isDeleting =
                  deleteMutation.isPending &&
                  deleteMutation.variables === task.id;

                const isToggling =
                  toggleMutation.isPending &&
                  toggleMutation.variables?.id === task.id;

                return (
                  <TableRow key={task.id} className="group transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={isCompleted}
                        disabled={isToggling}
                        onCheckedChange={() => {
                          toggleMutation.mutate({
                            id: task.id,
                            status: isCompleted ? "TODO" : "DONE",
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell
                      className={
                        isCompleted
                          ? "line-through text-muted-foreground transition-all"
                          : "font-medium"
                      }
                    >
                      {task.title}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground text-sm">
                      {task.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        onClick={() => {
                          if (confirm("Permanently delete this task?")) {
                            deleteMutation.mutate(task.id);
                          }
                        }}
                        className="hover:opacity-100 hover:text-destructive transition-all"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-2 py-4 border-t">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground">{tasks.length}</span> of{" "}
          <span className="text-foreground">{pagination?.total ?? 0}</span>{" "}
          tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
