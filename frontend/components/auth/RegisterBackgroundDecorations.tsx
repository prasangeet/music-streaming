import React from "react";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ShieldCheck } from "lucide-react";

export function RegisterBackgroundDecorations() {
  return (
    <>
      <div className="absolute top-10 right-10 hidden md:block -rotate-6">
        <Badge className="bg-[var(--chart-4)] text-black font-heading text-sm px-4 py-2 border-2 border-border shadow-md">
          <BarChart3 className="w-4 h-4 mr-1.5 inline-block" /> Live Analytics
        </Badge>
      </div>
      <div className="absolute bottom-10 left-10 hidden md:block rotate-6">
        <Badge className="bg-[var(--chart-3)] text-black font-heading text-sm px-4 py-2 border-2 border-border shadow-md">
          <ShieldCheck className="w-4 h-4 mr-1.5 inline-block" /> Secure Storage
        </Badge>
      </div>
    </>
  );
}
