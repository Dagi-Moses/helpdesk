"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiClient, tokenStore } from "@/lib/api-client";
import { AuthResponse, User } from "@/lib/types";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStore.getAccess()) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiClient.get<User>("/auth/me");
        setUser(res.data);
      } catch {
        tokenStore.clear();
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (input: LoginInput) => {
    const res = await apiClient.post<AuthResponse>("/auth/login", input, true);
    tokenStore.set(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    router.push("/dashboard");
  };

  const register = async (input: RegisterInput) => {
    const res = await apiClient.post<AuthResponse>("/auth/register", input, true);
    tokenStore.set(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    router.push("/dashboard");
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
