"use client";

import React, { useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, KeyRound, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { LoginRequest } from "@/types";

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  isLoading?: boolean;
  loadingText?: string;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  loadingText = "Signing In...",
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="border-2 border-border shadow-[var(--shadow)] relative">
      <Badge className="absolute -top-3 -right-3 bg-main text-main-foreground font-heading border border-border px-3 py-0.5 text-xs">
        JWT AUTH 🔒
      </Badge>

      <CardHeader>
        <CardTitle className="font-heading uppercase text-2xl">Sign In</CardTitle>
        <CardDescription className="font-base text-xs">
          Enter your credentials to unlock your personalized dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form action="" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-heading text-xs uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-main" /> Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
              className="border-2 border-border focus-visible:ring-main font-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-heading text-xs uppercase flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-main" /> Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="border-2 border-border focus-visible:ring-main font-base pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isLoading}
            className="w-full font-heading uppercase text-base mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4 bg-secondary-background/50 rounded-b-lg">
        <p className="font-base text-sm text-foreground/80">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-heading text-main underline underline-offset-4 hover:opacity-80">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
