"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Mail, RefreshCw} from "lucide-react";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
const [isResending, setIsResending] = useState(false);
const [registerEmail, setRegisterEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onBlur" });
useEffect(() => {
  if (resendCooldown <= 0) return;

  const timer = setInterval(() => {
    setResendCooldown((current) => current - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendCooldown]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleResendVerification = async () => {
  if (resendCooldown > 0 || isResending) return;

  setIsResending(true);

  try {
    await apiClient.post(
      "/auth/resend-verification",
      { email: registerEmail },
      true
    );

    toast.success("Verification email sent. Check your inbox.");

    setResendCooldown(30);
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

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const message = await registerUser(data);
          setRegisterEmail(data.email);
      setSuccessMessage(message);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center justify-center">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Mail className="h-7 w-7" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Check your email
        </h1>

        {/* Message */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {successMessage}
        </p>

        {/* Email */}
        <p className="mt-3 text-sm font-medium">
          {registerEmail}
        </p>

        {/* Help text */}
        <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground/70">
          Click the verification link in the email to activate your account.
          Check your spam or junk folder if you don&apos;t see it.
        </p>

 <p className="text-xs text-muted-foreground/60 mt-6">
            Didn&apos;t receive the email?
          </p>
        </div>
        {/* Resend */}
        <div className=" flex flex-col items-center ">
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isResending || resendCooldown > 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`}
            />

            {isResending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend email in ${resendCooldown}s`
                : "Resend verification email"}
          </button>

         

        {/* Continue */}
        <Link
          href="/login"
          className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue to sign in
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AuthShell>
  );
}else {

    return (
      <AuthShell>
        <div className="mb-8 space-y-1">
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            New accounts are registered as employees. Agent and admin access is granted by an administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

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


          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
            <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...register("confirmPassword")}
              className="[&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
           <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  < EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
           
            </div>
            
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </AuthShell>
    );
  }
}