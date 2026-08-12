"use client";

import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { TicketRow } from "@/components/tickets/ticket-row";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useDashboardStats, useTickets } from "@/hooks/use-tickets";
import { AgentStats, AdminStats, EmployeeStats } from "@/lib/types";
import { Inbox, CheckCircle2, AlertTriangle, Clock, LayoutGrid, XCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: statsRes, isLoading: statsLoading } = useDashboardStats();
  const { data: ticketsRes, isLoading: ticketsLoading } = useTickets({ limit: 5 });

  const stats = statsRes?.data;
  const tickets = ticketsRes?.data ?? [];

  return (
    <>
      <Topbar title={`Welcome back, ${user?.firstName}`} />

      <div className="space-y-8 p-6">
        <section>
          {statsLoading || !stats ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : user?.role === "EMPLOYEE" ? (
            <EmployeeStatGrid stats={stats as EmployeeStats} />
          ) : user?.role === "SUPPORT_AGENT" ? (
            <AgentStatGrid stats={stats as AgentStats} />
          ) : (
            <AdminStatGrid stats={stats as AdminStats} />
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent tickets
            </h2>
            <Link href="/tickets" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>

          {ticketsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No tickets yet.{" "}
                <Link href="/tickets/new" className="font-medium text-primary hover:underline">
                  Create one
                </Link>{" "}
                to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <TicketRow key={t.id} ticket={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function EmployeeStatGrid({ stats }: { stats: EmployeeStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatCard label="My tickets" value={stats.total} icon={LayoutGrid} />
      <StatCard label="Open" value={stats.open} icon={Inbox} accentColor="#2451B3" />
      <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentColor="#0F9E8E" />
    </div>
  );
}

function AgentStatGrid({ stats }: { stats: AgentStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Assigned to me" value={stats.assigned} icon={Inbox} />
      <StatCard label="Critical" value={stats.critical} icon={AlertTriangle} accentColor="#D64545" />
      <StatCard label="Pending" value={stats.pending} icon={Clock} accentColor="#E8A23D" />
      <StatCard label="Completed today" value={stats.completedToday} icon={CheckCircle2} accentColor="#0F9E8E" />
    </div>
  );
}

function AdminStatGrid({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total tickets" value={stats.total} icon={LayoutGrid} />
      <StatCard label="Open" value={stats.open} icon={Inbox} accentColor="#2451B3" />
      <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentColor="#0F9E8E" />
      <StatCard label="Closed" value={stats.closed} icon={XCircle} accentColor="#5B6169" />
    </div>
  );
}
