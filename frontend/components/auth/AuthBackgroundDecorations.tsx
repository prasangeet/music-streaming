import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Music } from "lucide-react";

export function AuthBackgroundDecorations() {
  return (
    <>
      <div className="absolute top-10 left-10 hidden md:block rotate-6">
        <Badge className="bg-[var(--chart-3)] text-black font-heading text-sm px-4 py-2 border-2 border-border shadow-md">
          <Sparkles className="w-4 h-4 mr-1.5 inline-block" /> Save Tracks
        </Badge>
      </div>
      <div className="absolute bottom-10 right-10 hidden md:block -rotate-6">
        <Badge className="bg-[var(--chart-2)] text-white font-heading text-sm px-4 py-2 border-2 border-border shadow-md">
          <Music className="w-4 h-4 mr-1.5 inline-block" /> Explore Insights
        </Badge>
      </div>
    </>
  );
}
