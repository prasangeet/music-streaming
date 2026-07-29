"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, PieChart, User, Calendar, Star, ArrowUpRight } from "lucide-react";

interface AnalyticsQuickNavProps {
  onNavigateAnalytics: (tab?: string) => void;
}

const ANALYTICS_CARDS = [
  { tab: "genres", title: "Genres", icon: PieChart, colorClass: "text-main" },
  { tab: "artists", title: "Artists", icon: User, colorClass: "text-[var(--chart-2)]" },
  { tab: "releases", title: "Releases", icon: Calendar, colorClass: "text-[var(--chart-4)]" },
  { tab: "ratings", title: "Ratings", icon: Star, colorClass: "text-yellow-400" },
];

export function AnalyticsQuickNav({ onNavigateAnalytics }: AnalyticsQuickNavProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-border pb-2">
        <h2 className="text-xl font-heading uppercase flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-main" /> Catalog Insights
        </h2>
        <Button
          variant="neutral"
          size="sm"
          onClick={() => onNavigateAnalytics()}
          className="font-heading text-xs uppercase"
        >
          View Full Analytics <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ANALYTICS_CARDS.map(({ tab, title, icon: Icon, colorClass }) => (
          <Card
            key={tab}
            onClick={() => onNavigateAnalytics(tab)}
            className="hover:-translate-y-1 transition-transform border-2 border-border cursor-pointer"
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${colorClass}`} />
                <ArrowUpRight className="w-4 h-4 text-foreground/50" />
              </div>
              <CardTitle className="font-heading uppercase text-lg mt-2">{title}</CardTitle>
              <CardDescription className="font-base text-xs">
                `/dashboard/analytics?tab=${tab}`
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
