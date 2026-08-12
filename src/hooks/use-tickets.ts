"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError } from "@/lib/api-client";
import {
  Category,
  Comment,
  DashboardStats,
  Priority,
  Ticket,
  TicketStatus,
} from "@/lib/types";
import { CreateTicketInput } from "@/lib/validations/ticket";

interface ListTicketsFilters {
  status?: TicketStatus;
  priority?: Priority;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export function useTickets(filters: ListTicketsFilters = {}) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () =>
      apiClient.get<Ticket[]>("/tickets", {
        status: filters.status,
        priority: filters.priority,
        categoryId: filters.categoryId,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      }),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => apiClient.get<Ticket>(`/tickets/${id}`),
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiClient.get<DashboardStats>("/tickets/dashboard/stats"),
  });
}

function onApiError(err: unknown) {
  const message = err instanceof ApiError ? err.message : "Something went wrong";
  toast.error(message);
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<Category[]>("/categories"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      apiClient.post<Category>("/categories", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: onApiError,
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: onApiError,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) => apiClient.post<Ticket>("/tickets", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Ticket created");
    },
    onError: onApiError,
  });
}

export function useUpdateTicketStatus(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: TicketStatus) => apiClient.patch<Ticket>(`/tickets/${ticketId}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Status updated");
    },
    onError: onApiError,
  });
}

export function useAssignTicket(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assignedToId: string) =>
      apiClient.patch<Ticket>(`/tickets/${ticketId}/assign`, { assignedToId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket assigned");
    },
    onError: onApiError,
  });
}

export function useAddComment(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { body: string; isInternal?: boolean }) =>
      apiClient.post<Comment>(`/tickets/${ticketId}/comments`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Comment added");
    },
    onError: onApiError,
  });
}
