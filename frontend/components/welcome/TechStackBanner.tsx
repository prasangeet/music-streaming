import React from "react";
import { Card } from "@/components/ui/card";
import { Database, Layers, Music } from "lucide-react";

export function TechStackBanner() {
  return (
    <section>
      <Card className="p-6 flex flex-wrap items-center justify-around gap-4 font-heading text-sm md:text-base">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-main" /> Spring Boot + Postgres
        </div>
        <span className="text-main">★</span>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--chart-2)]" /> Next.js + Tailwind
        </div>
        <span className="text-main">★</span>
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[var(--chart-4)]" /> iTunes API Integration
        </div>
      </Card>
    </section>
  );
}
