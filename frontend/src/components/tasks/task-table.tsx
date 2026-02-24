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

  // Helper to change pages via URL
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // --- DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  // --- TOGGLE STATUS MUTATION (Uses existing updateTask endpoint) ---
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/tasks/${id}`, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousData = queryClient.getQueriesData({
        queryKey: ["tasks"],
      });

      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          tasks: old.tasks.map((t: any) =>
            t.id === id ? { ...t, status } : t,
          ),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      context?.previousData?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      toast.error("Failed to update status");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

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

                return (
                  <TableRow key={task.id} className="group transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={isCompleted}
                        disabled={toggleMutation.isPending}
                        onCheckedChange={() => {
                          const nextStatus = isCompleted ? "TODO" : "DONE";
                          toggleMutation.mutate({
                            id: task.id,
                            status: nextStatus,
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
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm("Permanently delete this task?")) {
                            deleteMutation.mutate(task.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                      >
                        {deleteMutation.isPending ? (
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

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-between px-2 py-4 border-t">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground">{tasks.length}</span> of{" "}
          <span className="text-foreground">{pagination.total}</span> tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
