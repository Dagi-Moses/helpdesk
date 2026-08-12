import { cn } from "@/lib/utils";
import { Priority, TicketStatus } from "@/lib/types";

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "#2451B3" },
  ASSIGNED: { label: "Assigned", color: "#7C5CBF" },
  IN_PROGRESS: { label: "In progress", color: "#E8A23D" },
  WAITING_FOR_USER: { label: "Waiting for user", color: "#8A93A0" },
  RESOLVED: { label: "Resolved", color: "#0F9E8E" },
  CLOSED: { label: "Closed", color: "#5B6169" },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  LOW: { label: "Low", color: "#8A93A0" },
  MEDIUM: { label: "Medium", color: "#E8A23D" },
  HIGH: { label: "High", color: "#E0692F" },
  CRITICAL: { label: "Critical", color: "#D64545" },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-0.5 text-xs font-mono font-medium tracking-wide">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-0.5 text-xs font-mono font-medium tracking-wide">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}

export function priorityRailColor(priority: Priority) {
  return PRIORITY_CONFIG[priority].color;
}

export function statusRailColor(status: TicketStatus) {
  return STATUS_CONFIG[status].color;
}

export function StatusRail({
  color,
  className,
  children,
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("status-rail pl-4", className)}
      style={{ "--rail-color": color } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
