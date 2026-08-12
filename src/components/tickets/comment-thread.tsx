"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, initials } from "@/lib/utils";
import { useAddComment } from "@/hooks/use-tickets";
import { Lock } from "lucide-react";

export function CommentThread({
  ticketId,
  comments,
  canPostInternal,
}: {
  ticketId: string;
  comments: Comment[];
  canPostInternal: boolean;
}) {
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const addComment = useAddComment(ticketId);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    await addComment.mutateAsync({ body, isInternal });
    setBody("");
    setIsInternal(false);
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>{initials(c.author.firstName, c.author.lastName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {c.author.firstName} {c.author.lastName}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                  {c.isInternal && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      Internal
                    </Badge>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 border-t border-border pt-4">
        <Textarea
          placeholder="Add a comment…"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex items-center justify-between">
          {canPostInternal ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="h-3.5 w-3.5 rounded-sm border-input"
              />
              Internal note (not visible to the employee)
            </label>
          ) : (
            <span />
          )}
          <Button size="sm" onClick={handleSubmit} disabled={addComment.isPending || !body.trim()}>
            {addComment.isPending ? "Posting…" : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
