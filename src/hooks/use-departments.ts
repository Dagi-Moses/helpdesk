"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { Department } from "@/lib/types";

function onApiError(err: unknown) {
  toast.error(err instanceof ApiError ? err.message : "Something went wrong");
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => apiClient.get<Department[]>("/departments"),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => apiClient.post<Department>("/departments", { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created");
    },
    onError: onApiError,
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/departments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted");
    },
    onError: onApiError,
  });
}