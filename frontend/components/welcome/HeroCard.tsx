import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

export function HeroCard() {
  return (
    <div className="lg:col-span-5">
      <Card className="relative bg-[var(--chart-4)] text-black p-2 border-2 border-border shadow-lg">
        <CardContent className="bg-secondary-background text-foreground p-6 space-y-4 rounded-md border border-border mt-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <Badge className="bg-[var(--chart-3)] text-black hover:bg-[var(--chart-3)] font-heading">
              AI Trend Analysis
            </Badge>
            <Radio className="w-5 h-5 text-main animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-xl">&quot;80% Alternative &amp; Synthwave&quot;</h3>
            <p className="text-sm opacity-90 font-base">
              Your library heavily leans towards 2000s indie rock. Recommendation: Add track &quot;Parachutes&quot; by Coldplay.
            </p>
          </div>

          <div className="bg-background text-foreground border border-border p-3 font-mono text-xs flex justify-between items-center rounded-sm">
            <span>DATABASE: PostgreSQL</span>
            <span className="text-[var(--chart-4)] font-heading">CONNECTED</span>
          </div>
        </CardContent>

        <Badge className="absolute -top-3 -right-3 bg-main text-main-foreground font-heading px-3 py-1 shadow-md rotate-3 text-xs border border-border">
          JWT SECURED 🔒
        </Badge>
      </Card>
    </div>
  );
}
