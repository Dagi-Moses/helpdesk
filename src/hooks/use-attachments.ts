"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tokenStore, ApiError } from "@/lib/api-client";
import { Attachment } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

function onApiError(err: unknown) {
  toast.error(err instanceof ApiError ? err.message : "Something went wrong");
}

export function useUploadAttachments(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const token = tokenStore.getAccess();
      const res = await fetch(`${API_URL}/tickets/${ticketId}/attachments`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new ApiError(json.message || "Upload failed", res.status);
      return json.data as Attachment[];
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Files uploaded");
    },
    onError: onApiError,
  });
}

export function useDeleteAttachment(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (attachmentId: string) => {
      const token = tokenStore.getAccess();
      const res = await fetch(`${API_URL}/attachments/${attachmentId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok && res.status !== 204) {
        const json = await res.json().catch(() => ({}));
        throw new ApiError(json.message || "Delete failed", res.status);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      toast.success("Attachment deleted");
    },
    onError: onApiError,
  });
}

export function attachmentDownloadHref(downloadUrl: string) {
  return `${API_URL}${downloadUrl}`;
}