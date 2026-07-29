"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getCurrentUser, login } from "@/api";
import { LoginRequest } from "@/types";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthBackgroundDecorations } from "@/components/auth/AuthBackgroundDecorations";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { getToken, removeToken, setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        return;
      }

      try {
        await getCurrentUser();
        router.replace("/dashboard");
      } catch {
        removeToken();
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);

    try {
      const promise = login(credentials);

      toast.promise(promise, {
        loading: "Signing you in...",
        success: "Welcome back!",
        error: (error) =>
          error.response?.data?.message ?? "Login failed.",
      });

      const response = await promise;

      setToken(response.token);

      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <AuthBackgroundDecorations />

      <div className="w-full max-w-md space-y-6">
        <AuthHeader subtitle="Welcome back! Sign in to access your library." />

        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          loadingText="Signing in..."
        />
      </div>
    </div>
  );
}
