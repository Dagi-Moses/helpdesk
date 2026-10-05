import { ReactNode } from "react";
import { Headset, Terminal, TicketCheck } from "lucide-react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand Panel */}
      <div className="relative hidden overflow-hidden bg-console text-console-foreground lg:flex lg:flex-col lg:justify-between p-10">
        {/* Subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-white">
         
<TicketCheck className="h-4 w-4" />
            HELPDESK
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
      
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
            Keep your
            <br />
            <span className="text-console-foreground/60">
              organization moving.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-6 text-console-foreground/60">
            Manage support requests, track incidents, and give your team a
            faster way to resolve IT issues.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
            <div className="bg-console p-5">
              <p className="font-display text-2xl font-semibold text-white">
                24/7
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-console-foreground/40">
                Support operations
              </p>
            </div>

            <div className="bg-console p-5">
              <p className="font-display text-2xl font-semibold text-white">
                End-to-end
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-console-foreground/40">
                Ticket visibility
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="font-mono text-xs text-console-foreground/40">
            Enterprise IT support, built for faster resolution.
          </p>
        </div>
      </div>

      {/* Authentication */}
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}


function LogLine({ time, text, color }: { time: string; text: string; color: string }) {
  return (
    <div className="flex items-start gap-2 border-l border-console-border pl-3">
      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <span className="text-console-foreground/40">{time}</span>{" "}
        <span className="text-console-foreground/80">{text}</span>
      </div>
    </div>
  );
}
