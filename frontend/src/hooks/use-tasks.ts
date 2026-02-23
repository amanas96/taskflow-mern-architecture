import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useTasks = (filters: {
  page: number;
  search: string;
  status: string;
}) => {
  const queryClient = useQueryClient();

  // GET Tasks with Pagination & Filtering
  const tasksQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const { data } = await api.get("/tasks", { params: filters });
      return data;
    },
  });

  // PATCH: Toggle Status (Optimistic Update)
  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/toggle`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks", filters]);
      // Manually update the cache for instant UI feedback
      return { previousTasks };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasksQuery, toggleMutation };
};
