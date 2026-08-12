import { TicketHistoryEntry } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

function describeChange(entry: TicketHistoryEntry) {
  if (entry.field === "status") {
    return (
      <>
        changed status <code className="rounded-sm bg-muted px-1 py-0.5">{entry.oldValue}</code> →{" "}
        <code className="rounded-sm bg-muted px-1 py-0.5">{entry.newValue}</code>
      </>
    );
  }
  if (entry.field === "assignedTo") {
    return <>reassigned this ticket</>;
  }
  return (
    <>
      changed {entry.field}: {entry.oldValue ?? "—"} → {entry.newValue ?? "—"}
    </>
  );
}

export function HistoryTimeline({ history }: { history: TicketHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>;
  }

  return (
    <div className="space-y-0">
      {history.map((entry, i) => (
        <div key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i !== history.length - 1 && (
            <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden />
          )}
          <span className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-primary bg-background" />
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-sm">
              <span className="font-medium">
                {entry.user.firstName} {entry.user.lastName}
              </span>{" "}
              <span className="text-muted-foreground">{describeChange(entry)}</span>
            </p>
            <p className="font-mono text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
