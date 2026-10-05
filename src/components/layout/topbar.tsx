"use client";

import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { NotificationBell } from "@/components/layout/notification-bell";

export function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <h1 className="font-display text-lg font-semibold">{title}</h1>
     <div className="flex items-center gap-2">
        <NotificationBell />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-md px-2 py-1.5 outline-none hover:bg-muted">
          <Avatar>
            <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-tight text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      
    </header>
  );
}
