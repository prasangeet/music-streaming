"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, BarChart3, LayoutDashboard, ArrowRight } from "lucide-react";
import { HeroCard } from "./HeroCard";
import { CurrentUserResponse } from "@/types";

interface HeroSectionProps {
  user?: CurrentUserResponse | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
      <div className="lg:col-span-7 space-y-6">
        <Badge variant="default" className="bg-[var(--chart-3)] text-black px-3 py-1 text-sm font-heading gap-1.5 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4" /> Music Catalog Insights Platform
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading uppercase leading-tight tracking-tight">
          Curate <span className="bg-[var(--chart-2)] text-white px-2 py-0.5 inline-block transform -rotate-1 rounded-sm">Your Catalog</span>. <br />
          Analyze With <span className="bg-main text-main-foreground px-2 py-0.5 inline-block transform rotate-1 mt-2 rounded-sm">AI</span>.
        </h1>

        <p className="text-lg md:text-xl font-base border-l-4 border-main pl-4 py-2 bg-secondary-background rounded-r-md">
          Search millions of tracks via iTunes, build your custom library, visualize audio trends, and uncover AI-driven insights about your music tastes.
        </p>

        {/* Dynamic CTAs depending on authentication state */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {user ? (
            <>
              <Button size="lg" className="text-base font-heading uppercase" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="neutral" className="text-base font-heading uppercase border-2 border-border" asChild>
                <Link href="/dashboard/search" className="flex items-center gap-2">
                  <Search className="w-5 h-5" /> Explore Catalog
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" className="text-base font-heading uppercase" asChild>
                <Link href="/register" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="neutral" className="text-base font-heading uppercase border-2 border-border" asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> View Demo
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <HeroCard />
    </section>
  );
}
