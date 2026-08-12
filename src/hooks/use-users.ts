"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import { Role, User } from "@/lib/types";

function onApiError(err: unknown) {
  toast.error(err instanceof ApiError ? err.message : "Something went wrong");
}

export function useUsers(role?: Role) {
  return useQuery({
    queryKey: ["users", role],
    queryFn: () => apiClient.get<User[]>("/users", { role }),
  });
}

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => apiClient.post<User>("/users", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created");
    },
    onError: onApiError,
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch<User>(`/users/${id}/deactivate`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated");
    },
    onError: onApiError,
  });
}
