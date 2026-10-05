"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { AppNotification } from "@/lib/types";
import { formatDateTime, cn } from "@/lib/utils";
import { Bell } from "lucide-react";

function typeColor(type: AppNotification["type"]) {
  switch (type) {
    case "TICKET_CREATED":
      return "#2451B3";
    case "TICKET_ASSIGNED":
      return "#7C5CBF";
    case "TICKET_COMMENTED":
      return "#E8A23D";
    case "TICKET_RESOLVED":
      return "#0F9E8E";
    case "TICKET_CLOSED":
      return "#5B6169";
  }
}

export function NotificationBell() {
  const router = useRouter();
  const { data: notificationsRes } = useNotifications();
  const { data: countRes } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = notificationsRes?.data ?? [];
  const unreadCount = countRes?.data.count ?? 0;


  const handleClick = (n: AppNotification) => {
    if (!n.isRead) markRead.mutate(n.id);
    if (n.ticketId) router.push(`/tickets/${n.ticketId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-md outline-none hover:bg-muted">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal text-primary hover:underline"
              onClick={() => markAllRead.mutate()}
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn("flex flex-col items-start gap-0.5 py-2", !n.isRead && "bg-muted/60")}
              >
                <div className="flex w-full items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: typeColor(n.type) }}
                  />
                  <span className="truncate text-sm font-medium">{n.title}</span>
                </div>
                <p className="truncate pl-3.5 text-xs text-muted-foreground">{n.message}</p>
                <p className="pl-3.5 font-mono text-[10px] text-muted-foreground">{formatDateTime(n.createdAt)}</p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}