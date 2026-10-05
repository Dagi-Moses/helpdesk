"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AppNotification } from "@/lib/types";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.get<AppNotification[]>("/notifications"),
    refetchInterval: 20_000, // poll every 20s — no websockets in this stack yet
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () => apiClient.get<{ count: number }>("/notifications/unread-count"),
    refetchInterval: 20_000,
  });
}
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: (_data, id) => {
      qc.setQueryData<{ success: boolean; message: string; data: AppNotification[] }>(
        ["notifications"],
        (old) =>
          old && {
            ...old,
            data: old.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          }
      );
      qc.setQueryData<{ success: boolean; message: string; data: { count: number } }>(
        ["notifications-unread-count"],
        (old) => old && { ...old, data: { count: Math.max(0, old.data.count - 1) } }
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all"),
    onSuccess: () => {
      qc.setQueryData<{ success: boolean; message: string; data: AppNotification[] }>(
        ["notifications"],
        (old) => old && { ...old, data: old.data.map((n) => ({ ...n, isRead: true })) }
      );
      qc.setQueryData<{ success: boolean; message: string; data: { count: number } }>(
        ["notifications-unread-count"],
        (old) => old && { ...old, data: { count: 0 } }
      );
    },
  });
}
export function useMarkTicketNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => apiClient.patch(`/notifications/ticket/${ticketId}/read`),
    onSuccess: (_data, ticketId) => {
      qc.setQueryData<{ success: boolean; message: string; data: AppNotification[] }>(
        ["notifications"],
        (old) =>
          old && {
            ...old,
            data: old.data.map((n) => (n.ticketId === ticketId ? { ...n, isRead: true } : n)),
          }
      );
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}