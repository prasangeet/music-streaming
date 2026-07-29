"use client";

import React from "react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Music, DiscAlbum, ArrowUpRight } from "lucide-react";
import { ItunesAlbumDto } from "@/types";
import { ItunesSearchResultCard } from "./ItunesSearchResultCard";

interface CatalogExplorerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: ItunesAlbumDto[];
  savedCollectionIds?: Set<number>;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onSaveAlbum: (album: ItunesAlbumDto) => void;
}

export function CatalogExplorer({
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  savedCollectionIds = new Set(),
  onSearch,
  onSaveAlbum,
}: CatalogExplorerProps) {
  return (
    <section className="space-y-6">
      {/* Analytics-style Hero Banner & Search Form */}
      <div className="bg-[var(--chart-3)] text-black p-6 rounded-base border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <Badge className="bg-black text-white font-heading text-xs mb-1 border border-border">
            MUSIC VAULT 🎵
          </Badge>
          <h1 className="text-3xl font-heading uppercase flex items-center gap-2">
            <Search className="w-7 h-7" /> Catalog Explorer
          </h1>
          <p className="font-base text-xs opacity-90">
            Search millions of albums on iTunes and save them directly to your local library.
          </p>
        </div>

        {/* Search Input Bar */}
        <Form
          action=""
          onSubmit={onSearch}
          className="flex w-full lg:w-auto items-center gap-2"
        >
          <Input
            name="query"
            type="text"
            placeholder="Search artists or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="w-full lg:w-80 border-2 border-border font-base bg-background text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          <Button
            type="submit"
            variant="default"
            disabled={isSearching}
            className="font-heading uppercase border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </Form>
      </div>

      {/* Search Results Grid or Neobrutalist Prompt Banner */}
      {searchResults.length > 0 ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b-2 border-border pb-2">
            <h2 className="font-heading uppercase text-sm text-foreground flex items-center gap-1.5">
              <Music className="w-4 h-4 text-main" /> iTunes Results
            </h2>
            <Badge
              variant="neutral"
              className="font-heading text-xs border border-border"
            >
              {searchResults.length} Found
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((album) => (
              <ItunesSearchResultCard
                key={album.collectionId}
                album={album}
                isSaved={savedCollectionIds.has(album.collectionId)}
                onSave={onSaveAlbum}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Neobrutalist Prompt State Container */
        <div className="p-10 border-2 border-dashed border-border rounded-base bg-background text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center space-y-4 my-6">
          <div className="p-4 bg-main/20 border-2 border-border rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <DiscAlbum className="w-10 h-10 text-main" />
          </div>

          <div className="space-y-2 max-w-md">
            <Badge
              variant="neutral"
              className="font-heading text-[10px] uppercase border border-border px-2 py-0.5 bg-secondary text-secondary-foreground"
            >
              READY TO DISCOVER ⚡
            </Badge>
            <h3 className="font-heading text-xl uppercase tracking-wide">
              Type a Query & Click Search
            </h3>
            <p className="font-base text-xs text-muted-foreground leading-relaxed">
              Enter an artist or album name in the input box above, then click the{" "}
              <span className="font-heading text-foreground underline decoration-2">
                Search
              </span>{" "}
              button or press <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded text-[10px] font-mono">Enter</kbd> to explore the iTunes catalog.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
