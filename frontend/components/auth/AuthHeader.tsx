import React from "react";
import Link from "next/link";
import { Disc } from "lucide-react";

interface AuthHeaderProps {
  subtitle: string;
}

export function AuthHeader({ subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <Link href="/" className="inline-flex items-center gap-3">
        <div className="bg-[var(--chart-4)] p-2.5 rounded-md border-2 border-border shadow-sm">
          <Disc className="w-8 h-8 text-black animate-spin" style={{ animationDuration: "10s" }} />
        </div>
        <span className="text-3xl font-heading tracking-tight uppercase">
          TrackIQ<span className="text-main">.</span>
        </span>
      </Link>
      <p className="font-base text-sm text-foreground/80">{subtitle}</p>
    </div>
  );
}
