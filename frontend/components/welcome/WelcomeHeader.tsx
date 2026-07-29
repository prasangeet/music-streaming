"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Disc, ArrowRight, LayoutDashboard } from "lucide-react";
import { CurrentUserResponse } from "@/types";

interface WelcomeHeaderProps {
  user: CurrentUserResponse | null;
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  return (
    <header className="max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b border-border my-2">
      <div className="flex items-center gap-3">
        <div className="bg-[var(--chart-4)] p-2 rounded-md border border-border">
          <Disc className="w-6 h-6 text-black animate-spin" style={{ animationDuration: "10s" }} />
        </div>
        <span className="text-2xl font-heading tracking-tight uppercase">
          TrackIQ<span className="text-main">.</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Hide Log In button if authenticated */}
        {!user && (
          <Button variant="default" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log In</Link>
          </Button>
        )}

        {/* Dynamic CTA */}
        {user ? (
          <Button variant="default" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              Dashboard <LayoutDashboard className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="default" asChild>
            <Link href="/register" className="flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
