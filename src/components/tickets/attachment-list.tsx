"use client";

import { useRef, useState } from "react";
import { Attachment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { tokenStore } from "@/lib/api-client";
import { useUploadAttachments, useDeleteAttachment, attachmentDownloadHref } from "@/hooks/use-attachments";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime } from "@/lib/utils";
import { Paperclip, Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentList({ ticketId, attachments }: { ticketId: string; attachments: Attachment[] }) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const upload = useUploadAttachments(ticketId);
  const remove = useDeleteAttachment(ticketId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    upload.mutate(Array.from(files));
    e.target.value = "";
  };

  const handleDownload = async (attachment: Attachment) => {
    setIsDownloading(attachment.id);
    try {
      const token = tokenStore.getAccess();
      const res = await fetch(attachmentDownloadHref(attachment.downloadUrl), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't download that file");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-3">
      {attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attachments yet.</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((a) => {
            const canDelete = user?.role === "ADMIN" || a.uploadedBy?.id === user?.id;
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.fileName}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatFileSize(a.fileSize)} · {formatDateTime(a.createdAt)}
                      {a.uploadedBy && ` · ${a.uploadedBy.firstName} ${a.uploadedBy.lastName}`}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDownload(a)}
                    disabled={isDownloading === a.id}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  {canDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => remove.mutate(a.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
        >
          <Upload className="mr-2 h-3.5 w-3.5" />
          {upload.isPending ? "Uploading…" : "Upload files"}
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Up to 5 files, 10MB each. Images, PDFs, Office docs, text, and zip files.
        </p>
      </div>
    </div>
  );
}