"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { Eye, EyeOff, MailCheck } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  
    useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);


  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setShowResend(false);
    try {
      await login(data);
    } catch (err) {
           if (
        err instanceof ApiError &&
        err.code === "EMAIL_NOT_VERIFIED"
      ) {
        setShowResend(true);

        toast.error("Email not verified", {
          description:
            "Please verify your email before signing in.",
        });

        return;
      }
      toast.error(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleResendVerification = async () => {
    const email = getValues("email");

    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }

    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);

    try {
      await apiClient.post(
        "/auth/resend-verification",
        { email },
        true
      );

      toast.success("Verification email sent", {
        description:
          "Check your inbox for a new verification link.",
      });

      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };


  return (
    <AuthShell>
      <div className="mb-8 space-y-1">
        <h1 className="font-display text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Access your helpdesk workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

           <div className="space-y-1.5">
        
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
        
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          < EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>



      {/* Email verification resend */}
      {showResend && (
        <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MailCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                Email not verified
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Verify your email address before signing in.
                We can send you a new verification link.
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleResendVerification}
                disabled={
                  isResending || resendCooldown > 0
                }
              >
                {isResending
                  ? "Sending…"
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend verification email"}
              </Button>
            </div>
          </div>
        </div>
      )}
 
<p className="mt-6 text-center text-[0.85rem] text-muted-foreground">
  <Link href="/forgot-password" className="font-medium text-primary hover:underline">
        Forgot Password?{" "}
          </Link>
          Reset 
      
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>

    </AuthShell>
  );
}
