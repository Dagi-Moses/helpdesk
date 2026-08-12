"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  PlusCircle,
  Users,
  Tags,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["EMPLOYEE", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/tickets", label: "Tickets", icon: TicketIcon, roles: ["EMPLOYEE", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/tickets/new", label: "New ticket", icon: PlusCircle, roles: ["EMPLOYEE", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/categories", label: "Categories", icon: Tags, roles: ["ADMIN"] },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => (item.roles as readonly string[]).includes(user.role));

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-console text-console-foreground lg:flex">
      <div className="flex items-center gap-2 border-b border-console-border px-5 py-5">
        <Terminal className="h-4 w-4 text-white" />
        <span className="font-display text-sm font-semibold tracking-wide text-white">
          HELPDESK CONSOLE
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-display transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-console-foreground/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-console-border px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-console-foreground/40">
          Role
        </p>
        <p className="font-mono text-xs text-console-foreground/80">{user.role}</p>
      </div>
    </aside>
  );
}
