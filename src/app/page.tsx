"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TicketCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
     const timer = setTimeout(() => {
    router.replace(user ? "/dashboard" : "/login");
  }, 500);

  return () => clearTimeout(timer);
  }, [user, isLoading, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-xl bg-foreground/10" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <TicketCheck className="h-6 w-6 text-foreground" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="font-display text-sm font-semibold tracking-[0.18em] text-foreground">
            HELPDESK
          </h1>

          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Initializing workspace
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8 w-48">
          <div className="h-px overflow-hidden bg-border">
            <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] bg-foreground" />
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-6 font-mono text-[10px] tracking-wider text-muted-foreground/50">
        IT OPERATIONS PLATFORM
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(350%);
          }
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/auth-context";

// export default function RootPage() {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoading) return;
//     router.replace(user ? "/dashboard" : "/login");
//   }, [user, isLoading, router]);

//   return (
//     <div className="flex h-screen items-center justify-center bg-background">
//       <p className="font-mono text-sm text-muted-foreground">Loading…</p>
//     </div>
//   );
// }
