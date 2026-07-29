"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlbumResponse, AlbumInsightsResponse } from "@/types";
import { Star, Sparkles, RefreshCw, Heart, BookmarkCheck, Check } from "lucide-react";

interface SavedAlbumCardProps {
  album: AlbumResponse;
  aiInsight: AlbumInsightsResponse | null;
  aiLoadingId: number | null;
  onTriggerAiInsights: (albumId: number, e: React.MouseEvent) => void;
}

export function SavedAlbumCard({
  album,
  aiInsight,
  aiLoadingId,
  onTriggerAiInsights,
}: SavedAlbumCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/dashboard/albums/${album.id}`)}
      className="border-2 border-border shadow-[var(--shadow)] relative flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform overflow-hidden w-full max-w-full"
    >
      <CardHeader className="p-5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {/* SAVED Status Badge */}
            <Badge className="bg-main text-main-foreground font-heading text-[10px] uppercase border border-border flex items-center gap-1 shrink-0">
              <BookmarkCheck className="w-3 h-3" /> Saved
            </Badge>

            <Badge variant="neutral" className="font-heading text-xs uppercase truncate max-w-[120px]">
              {album.genre || "General"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {album.favourite && (
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            )}
            {album.userRating !== null && album.userRating !== undefined && (
              <div className="flex items-center gap-1 font-heading text-xs text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-yellow-400" /> {album.userRating}/5
              </div>
            )}
          </div>
        </div>

        {/* Artwork & Details Header */}
        <div className="flex gap-4 items-center mt-3 min-w-0 w-full">
          {album.artworkUrl && (
            <div className="relative w-16 h-16 rounded-md border-2 border-border overflow-hidden flex-shrink-0">
              <Image
                src={album.artworkUrl}
                alt={album.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          {/* Constrained Text Container */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <CardTitle className="font-heading text-lg uppercase truncate block w-full" title={album.title}>
              {album.title}
            </CardTitle>
            <CardDescription className="font-base text-sm truncate block w-full" title={album.artistName}>
              {album.artistName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {aiInsight && (
          <div className="p-3 bg-[var(--chart-4)]/20 border border-border rounded-md text-xs font-base space-y-1.5 overflow-hidden">
            <p className="font-heading flex items-center gap-1 text-main">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> AI Insight:
            </p>
            <p className="text-foreground/90 line-clamp-2">{aiInsight.summary}</p>
            {aiInsight.moods && aiInsight.moods.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {aiInsight.moods.slice(0, 3).map((mood, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-heading px-1.5 py-0.5 bg-background/60 border border-border/60 rounded truncate max-w-[100px]"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          variant={aiInsight ? "neutral" : "default"}
          size="sm"
          disabled={aiLoadingId === album.id}
          onClick={(e) => onTriggerAiInsights(album.id, e)}
          className="w-full font-heading text-xs uppercase gap-1.5"
        >
          {aiLoadingId === album.id ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
          ) : aiInsight ? (
            <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="truncate">
            {aiLoadingId === album.id
              ? "Analyzing..."
              : aiInsight
              ? "Regenerate AI Insights"
              : "Generate AI Insights"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
