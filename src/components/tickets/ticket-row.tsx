import Link from "next/link";
import { Ticket } from "@/lib/types";
import { StatusBadge, PriorityBadge, StatusRail, priorityRailColor } from "@/components/tickets/badges";
import { formatDate, ticketCode } from "@/lib/utils";

export function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <StatusRail
        color={priorityRailColor(ticket.priority)}
        className="flex items-center justify-between gap-4 rounded-md border border-border bg-card py-3.5 pr-4 transition-colors hover:border-primary/40"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{ticketCode(ticket.id)}</span>
            {ticket.category && (
              <span className="font-mono text-xs text-muted-foreground">· {ticket.category.name}</span>
            )}
          </div>
          <p className="truncate font-display text-sm font-medium">{ticket.title}</p>
          <p className="font-mono text-xs text-muted-foreground">
            Opened {formatDate(ticket.createdAt)} by {ticket.createdBy.firstName} {ticket.createdBy.lastName}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </StatusRail>
    </Link>
  );
}
