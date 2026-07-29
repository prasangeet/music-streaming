"use client";

import React, { useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, KeyRound, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { RegisterRequest } from "@/types";

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  isLoading?: boolean;
  loadingText?: string;
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  loadingText = "Creating Account...",
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { username, email, password } = formData;
    onSubmit({ username, email, password });
  };

  return (
    <Card className="border-2 border-border shadow-[var(--shadow)] relative">
      <Badge className="absolute -top-3 -right-3 bg-[var(--chart-3)] text-black font-heading border border-border px-3 py-0.5 text-xs">
        FREE ACCOUNT 🚀
      </Badge>

      <CardHeader>
        <CardTitle className="font-heading uppercase text-2xl">Create Account</CardTitle>
        <CardDescription className="font-base text-xs">
          Fill in your details below to set up your profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form action="" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="font-heading text-xs uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-main" /> Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isLoading}
              className="border-2 border-border focus-visible:ring-main font-base"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-heading text-xs uppercase flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-main" /> Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
                className="border-2 border-border focus-visible:ring-main font-base pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                Register <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4 bg-secondary-background/50 rounded-b-lg">
        <p className="font-base text-sm text-foreground/80">
          Already have an account?{" "}
          <Link href="/login" className="font-heading text-main underline underline-offset-4 hover:opacity-80">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
