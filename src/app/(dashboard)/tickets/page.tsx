"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { TicketRow } from "@/components/tickets/ticket-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTickets } from "@/hooks/use-tickets";
import { Priority, TicketStatus } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const STATUS_OPTIONS: TicketStatus[] = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING_FOR_USER",
  "RESOLVED",
  "CLOSED",
];
const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function TicketsPage() {
  const [status, setStatus] = useState<TicketStatus | undefined>();
  const [priority, setPriority] = useState<Priority | undefined>();

  const { data, isLoading } = useTickets({ status, priority, limit: 50 });
  const tickets = data?.data ?? [];

  return (
    <>
      <Topbar title="Tickets" />

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Select
              value={status ?? "ALL"}
              onValueChange={(v) => setStatus(v === "ALL" ? undefined : (v as TicketStatus))}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priority ?? "ALL"}
              onValueChange={(v) => setPriority(v === "ALL" ? undefined : (v as Priority))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All priorities</SelectItem>
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button asChild>
            <Link href="/tickets/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New ticket
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">No tickets match these filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <TicketRow key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
