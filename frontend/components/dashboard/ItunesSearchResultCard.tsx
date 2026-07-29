"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, BookmarkCheck } from "lucide-react";
import { ItunesAlbumDto } from "@/types";

interface ItunesSearchResultCardProps {
  album: ItunesAlbumDto;
  isSaved?: boolean;
  onSave: (album: ItunesAlbumDto) => void;
}

export function ItunesSearchResultCard({
  album,
  isSaved = false,
  onSave,
}: ItunesSearchResultCardProps) {
  return (
    <Card className="border-2 border-border shadow-sm flex flex-col justify-between overflow-hidden relative w-full max-w-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {/* SAVED Status Badge */}
            {isSaved && (
              <Badge className="bg-main text-main-foreground font-heading text-[10px] uppercase border border-border flex items-center gap-1 shrink-0">
                <BookmarkCheck className="w-3 h-3" /> Saved
              </Badge>
            )}

            <Badge className="w-fit bg-[var(--chart-3)] text-black border border-border text-[10px] font-heading truncate max-w-[120px]">
              {album.primaryGenreName || "General"}
            </Badge>
          </div>

          {album.trackCount && (
            <span className="text-[10px] font-heading text-muted-foreground shrink-0">
              {album.trackCount} Tracks
            </span>
          )}
        </div>

        {/* Artwork & Details */}
        <div className="flex gap-3 items-center min-w-0 w-full">
          {album.artworkUrl100 && (
            <div className="relative w-14 h-14 rounded-md border-2 border-border overflow-hidden flex-shrink-0">
              <Image
                src={album.artworkUrl100}
                alt={album.collectionName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          )}
          {/* Constrained Text Wrapper */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <CardTitle
              className="font-heading text-base truncate block w-full"
              title={album.collectionName}
            >
              {album.collectionName}
            </CardTitle>
            <CardDescription
              className="font-base text-xs truncate block w-full"
              title={album.artistName}
            >
              {album.artistName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 mt-2 flex justify-end">
        <Button
          size="sm"
          variant={isSaved ? "neutral" : "default"}
          disabled={isSaved}
          onClick={() => !isSaved && onSave(album)}
          className="w-full font-heading text-xs uppercase gap-1"
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span className="truncate">In Library</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Save Album</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
