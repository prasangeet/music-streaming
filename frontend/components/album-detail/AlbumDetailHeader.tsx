"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Trash2 } from "lucide-react";

interface AlbumDetailHeaderProps {
  title: string;
  onDelete: () => void;
}

export function AlbumDetailHeader({ title, onDelete }: AlbumDetailHeaderProps) {
  return (
    <header className="border-b-2 border-border bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="neutral" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center gap-1.5 font-heading text-xs uppercase">
              <ArrowLeft className="w-4 h-4" /> Back to Collection
            </Link>
          </Button>
          <span className="font-heading text-lg uppercase hidden sm:inline-block truncate max-w-xs">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="neutral"
            size="sm"
            onClick={onDelete}
            className="font-heading text-xs uppercase text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50"
          >
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
