"use client";

import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, PriorityBadge, priorityRailColor } from "@/components/tickets/badges";
import { CommentThread } from "@/components/tickets/comment-thread";
import { HistoryTimeline } from "@/components/tickets/history-timeline";
import { useTicket, useUpdateTicketStatus, useAssignTicket } from "@/hooks/use-tickets";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime, ticketCode } from "@/lib/utils";
import { TicketStatus } from "@/lib/types";
import { AttachmentList } from "@/components/tickets/attachment-list";
import { useEffect } from "react";
import { useMarkTicketNotificationsRead } from "@/hooks/use-notifications";

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["ASSIGNED", "IN_PROGRESS"],
  ASSIGNED: ["IN_PROGRESS", "OPEN"],
  IN_PROGRESS: ["WAITING_FOR_USER", "RESOLVED", "ASSIGNED"],
  WAITING_FOR_USER: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

export default function TicketDetailPage() {


  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data, isLoading } = useTicket(params.id);
  const updateStatus = useUpdateTicketStatus(params.id);
  const assignTicket = useAssignTicket(params.id);
  const { data: agentsRes } = useUsers("SUPPORT_AGENT");


  const { mutate: markTicketNotificationsRead } =
    useMarkTicketNotificationsRead();

  useEffect(() => {
    if (data?.data.id) {
      markTicketNotificationsRead(data.data.id);
    }
  }, [data?.data.id, markTicketNotificationsRead]);

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Ticket" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </>
    );
  }

  const ticket = data.data;
  const canManageStatus = user?.role === "SUPPORT_AGENT" || user?.role === "ADMIN";
  const canAssign = user?.role === "ADMIN";
  const transitions = ALLOWED_TRANSITIONS[ticket.status];




  return (
    <>
      <Topbar title={ticketCode(ticket.id)} />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent
              className="pt-6"
              style={{ borderLeft: `4px solid ${priorityRailColor(ticket.priority)}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold">{ticket.title}</h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    Opened {formatDateTime(ticket.createdAt)} by {ticket.createdBy.firstName}{" "}
                    {ticket.createdBy.lastName}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <Separator className="my-4" />
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  <CommentThread
                    ticketId={ticket.id}
                    comments={ticket.comments ?? []}
                    canPostInternal={user?.role !== "EMPLOYEE"}
                  />
                </TabsContent>
                <TabsContent value="attachments">
                  <AttachmentList ticketId={ticket.id} attachments={ticket.attachments ?? []} />
                </TabsContent>
                <TabsContent value="history">
                  <HistoryTimeline history={ticket.history ?? []} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="Category" value={ticket.category?.name ?? "Uncategorized"} />
              <DetailRow
                label="Assigned to"
                value={ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : "Unassigned"}
              />
              <DetailRow label="Created" value={formatDateTime(ticket.createdAt)} />
              {ticket.resolvedAt && <DetailRow label="Resolved" value={formatDateTime(ticket.resolvedAt)} />}
            </CardContent>
          </Card>

          {canManageStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Update status</CardTitle>
              </CardHeader>
              <CardContent>
                {transitions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No further transitions available.</p>
                ) : (
                  <Select
                    onValueChange={(v) => updateStatus.mutate(v as TicketStatus)}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Move to…" />
                    </SelectTrigger>
                    <SelectContent>
                      {transitions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          )}

          {canAssign && (
            <Card>
              <CardHeader>
                <CardTitle>Assign agent</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  defaultValue={ticket.assignedTo?.id}
                  onValueChange={(v) => assignTicket.mutate(v)}
                  disabled={assignTicket.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentsRes?.data.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
