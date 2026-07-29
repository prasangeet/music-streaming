"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit2, Check } from "lucide-react";

interface UserNotesCardProps {
  notes: string;
  setNotes: (notes: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave: () => void;
}

export function UserNotesCard({
  notes,
  setNotes,
  isEditing,
  setIsEditing,
  onSave,
}: UserNotesCardProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-border pb-2">
        <h2 className="font-heading uppercase text-lg flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-[var(--chart-2)]" /> Catalog Notes &amp; Memories
        </h2>
      </div>

      <Card className="border-2 border-border shadow-[var(--shadow)]">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="font-heading text-sm uppercase">User Notes</CardTitle>
          <CardDescription className="font-base text-xs">
            Stored in PostgreSQL under your account entity (`user_notes`).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write personal notes, thoughts, or listening logs..."
                className="border-2 border-border font-base text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="font-heading text-xs uppercase"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSave}
                  className="font-heading text-xs uppercase gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-base text-sm bg-secondary-background/50 p-4 rounded-md border border-border italic min-h-[70px]">
                {notes ? `"${notes}"` : "No personal notes added."}
              </p>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="font-heading text-xs uppercase gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Notes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
