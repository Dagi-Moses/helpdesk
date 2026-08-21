"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { apiClient, ApiError } from "@/lib/api-client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    apiClient
      .post<{ message: string }>("/auth/verify-email", { token }, true)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err instanceof ApiError ? err.message : "Verification failed."
        );
      });
  }, [token]);

  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        {/* Status icon */}
        <div
          className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
              : status === "loading"
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {status === "loading" ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <XCircle className="h-7 w-7" />
          )}
        </div>

        {/* Heading */}
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {status === "loading"
            ? "Verifying your email"
            : status === "success"
              ? "Email verified"
              : "Verification failed"}
        </h1>

        {/* Message */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        {/* Action */}
        {status !== "loading" && (
          <Link
            href="/login"
            className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue to sign in
          </Link>
        )}

        {/* Loading indicator */}
        {status === "loading" && (
          <p className="mt-7 text-xs text-muted-foreground">
            This should only take a moment.
          </p>
        )}
      </div>
    </AuthShell>
  );
}

function VerifyEmailFallback() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Verifying your email
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          This should only take a moment.
        </p>
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}



// "use client";

// import {Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { AuthShell } from "@/components/layout/auth-shell";
// import { apiClient, ApiError } from "@/lib/api-client";
// import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (!token) {
//       setStatus("error");
//       setMessage("Missing verification token.");
//       return;
//     }
//     apiClient
//       .post<{ message: string }>("/auth/verify-email", { token }, true)
//       .then((res) => {
//         setStatus("success");
//         setMessage(res.data.message);
//       })
//       .catch((err) => {
//         setStatus("error");
//         setMessage(err instanceof ApiError ? err.message : "Verification failed.");
//       });
//   }, [token]);

//   return (
//   <AuthShell>

//     <div className="flex flex-col items-center text-center">
      
//       {/* Status icon */}
//       <div
//         className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${
//           status === "success"
//             ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
//             : status === "loading"
//               ? "border-primary/20 bg-primary/10 text-primary"
//               : "border-destructive/20 bg-destructive/10 text-destructive"
//         }`}
//       >
//         {status === "loading" ? (
//           <Loader2 className="h-7 w-7 animate-spin" />
//         ) : status === "success" ? (
//           <CheckCircle2 className="h-7 w-7" />
//         ) : (
//           <XCircle className="h-7 w-7" />
//         )}
//       </div>

//       {/* Heading */}
//       <h1 className="font-display text-2xl font-semibold tracking-tight">
//         {status === "loading"
//           ? "Verifying your email"
//           : status === "success"
//             ? "Email verified"
//             : "Verification failed"}
//       </h1>

//       {/* Message */}
//       <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
//         {message}
//       </p>

//       {/* Action */}
//       {status !== "loading" && (
//         <Link
//           href="/login"
//           className="mt-7 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
//         >
//           Continue to sign in
//         </Link>
//       )}

//       {/* Loading indicator */}
//       {status === "loading" && (
//         <p className="mt-7 text-xs text-muted-foreground">
//           This should only take a moment.
//         </p>
//       )}
//     </div>
//   </AuthShell>
// );}