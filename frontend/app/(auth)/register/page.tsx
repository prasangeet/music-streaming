"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { register } from "@/api";
import { RegisterRequest } from "@/types";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterBackgroundDecorations } from "@/components/auth/RegisterBackgroundDecorations";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterRequest) => {
    setIsLoading(true);

    try {
      const promise = register(data);

      toast.promise(promise, {
        loading: "Creating your account...",
        success: "Account created successfully!",
        error: (error) =>
          error.response?.data?.message ?? "Registration failed.",
      });

      await promise;

      router.push("/login");
    } catch {
      // toast.promise displays the error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <RegisterBackgroundDecorations />

      <div className="w-full max-w-md space-y-6">
        <AuthHeader subtitle="Create an account to start analyzing your music collection." />

        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          loadingText="Creating account..."
        />
      </div>
    </div>
  );
}
