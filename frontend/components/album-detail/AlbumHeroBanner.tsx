"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlbumResponse } from "@/types";
import {
  Calendar,
  Music,
  Heart,
  Star,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface AlbumHeroBannerProps {
  album: AlbumResponse;
  rating: number | null;
  isGeneratingAi: boolean;
  onToggleFavourite: () => void;
  onRatingChange: (rating: number) => void;
  onGenerateAiInsight: () => void;
}

export function AlbumHeroBanner({
  album,
  rating,
  isGeneratingAi,
  onToggleFavourite,
  onRatingChange,
  onGenerateAiInsight,
}: AlbumHeroBannerProps) {
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : "N/A";

  const artworkSrc =
    album.artworkUrl ||
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="bg-secondary-background/80 p-6 md:p-8 rounded-lg border-2 border-border shadow-[var(--shadow)] flex flex-col md:flex-row gap-8 items-center md:items-start relative">
      {/* Artwork with Next.js Image */}
      <div className="w-48 h-48 md:w-56 md:h-56 relative rounded-md border-2 border-border overflow-hidden bg-black flex-shrink-0 shadow-[var(--shadow)]">
        <Image
          src={artworkSrc}
          alt={album.title}
          fill
          sizes="(max-width: 768px) 192px, 224px"
          priority
          className="object-cover"
        />
        {album.genre && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-[var(--chart-3)] text-black border border-border font-heading text-[10px] uppercase">
              {album.genre}
            </Badge>
          </div>
        )}
      </div>

      {/* Album Information */}
      <div className="flex-1 space-y-4 text-center md:text-left w-full">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <Badge variant="neutral" className="font-heading text-xs uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {releaseYear}
            </Badge>
            {album.trackCount && (
              <Badge variant="neutral" className="font-heading text-xs uppercase flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> {album.trackCount} Tracks
              </Badge>
            )}
            {album.appleCatalogId && (
              <Badge variant="neutral" className="font-heading text-[10px] text-foreground/60 uppercase">
                Apple ID: {album.appleCatalogId}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl md:text-4xl font-heading uppercase tracking-tight">
              {album.title}
            </h1>
            <button
              type="button"
              onClick={onToggleFavourite}
              title={album.favourite ? "Remove from favorites" : "Add to favorites"}
              className="p-1.5 rounded-full hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-7 h-7 ${
                  album.favourite
                    ? "fill-red-500 text-red-500"
                    : "text-foreground/40 hover:text-red-400"
                }`}
              />
            </button>
          </div>

          <p className="text-xl font-base text-foreground/80">{album.artistName}</p>
        </div>

        {/* User Rating */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          <span className="font-heading text-xs uppercase text-foreground/70">Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    rating !== null && star <= rating
                      ? "fill-yellow-400 text-yellow-500"
                      : "text-foreground/30 hover:text-yellow-400"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-heading text-sm text-yellow-500 ml-1">({rating}/5)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={onGenerateAiInsight}
            disabled={isGeneratingAi}
            className="font-heading text-xs uppercase gap-1.5"
          >
            {isGeneratingAi ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGeneratingAi ? "Analyzing..." : "Re-Run AI Analysis"}
          </Button>

          {album.appleCatalogId && (
            <Button
              variant="neutral"
              size="sm"
              asChild
              className="font-heading text-xs uppercase gap-1.5"
            >
              <a
                href={`https://music.apple.com/album/${album.appleCatalogId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" /> Apple Music Page
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
