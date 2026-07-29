"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrentUserResponse } from "@/types";
import { Disc, BarChart3, User as UserIcon, LogOut } from "lucide-react";

interface HeaderProps {
  user: CurrentUserResponse | null;
  onLogout: () => void;
  onNavigateAnalytics: (tab?: string) => void;
}

export function Header({ user, onLogout, onNavigateAnalytics }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b-2 border-border bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-[var(--chart-4)] p-2 rounded-md border-2 border-border">
            <Disc className="w-6 h-6 text-black animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <span className="text-2xl font-heading tracking-tight uppercase">
            TrackIQ<span className="text-main">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="neutral"
            size="sm"
            onClick={() => onNavigateAnalytics()}
            className="font-heading text-xs uppercase gap-1.5 hidden sm:inline-flex"
          >
            <BarChart3 className="w-4 h-4 text-main" /> Analytics
          </Button>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <Badge variant="neutral" className="gap-1.5 px-3 py-1 font-heading text-xs uppercase">
                <UserIcon className="w-3.5 h-3.5 text-main" /> {user.username}
              </Badge>
              <Button variant="neutral" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="neutral" size="sm" onClick={() => router.push("/login")}>
                Log In
              </Button>
              <Button variant="default" size="sm" onClick={() => router.push("/register")}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
