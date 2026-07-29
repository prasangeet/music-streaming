"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Layers, Sparkles, Loader2, Search, X } from "lucide-react";
import { AlbumResponse, AlbumInsightsResponse } from "@/types";
import { SavedAlbumCard } from "./SavedAlbumCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SavedLibraryProps {
  savedAlbums: AlbumResponse[];
  aiInsightMap: Record<number, AlbumInsightsResponse>;
  aiLoadingId: number | null;
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements?: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
  onTriggerAiInsights: (albumId: number, e: React.MouseEvent) => void;
}

export function SavedLibrary({
  savedAlbums,
  aiInsightMap,
  aiLoadingId,
  currentPage,
  totalPages,
  totalElements,
  isLoading = false,
  onPageChange,
  onTriggerAiInsights,
}: SavedLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return savedAlbums;
    const query = searchQuery.toLowerCase();
    return savedAlbums.filter(
      (album) =>
        album.title?.toLowerCase().includes(query) ||
        album.artistName?.toLowerCase().includes(query) ||
        album.genre?.toLowerCase().includes(query)
    );
  }, [savedAlbums, searchQuery]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push("...");
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  // Reusable Pagination Element
  const renderPagination = () => (
    <Pagination className="w-auto mx-0">
      <PaginationContent>
        {/* Previous Link */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 0 && !isLoading) {
                onPageChange(currentPage - 1);
              }
            }}
            aria-disabled={currentPage === 0 || isLoading}
            className={
              currentPage === 0 || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Dynamic Page Items */}
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) {
                    onPageChange(pageNum);
                  }
                }}
                className="cursor-pointer font-heading"
              >
                {pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Link */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages - 1 && !isLoading) {
                onPageChange(currentPage + 1);
              }
            }}
            aria-disabled={currentPage >= totalPages - 1 || isLoading}
            className={
              currentPage >= totalPages - 1 || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <section className="space-y-6 max-w-full overflow-hidden">
      {/* Hero Banner */}
      <div className="bg-[var(--chart-3)] text-black p-6 rounded-base border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-black text-white font-heading text-xs mb-1 border border-border">
            LOCAL LIBRARY ⚡
          </Badge>
          <h1 className="text-3xl font-heading uppercase flex items-center gap-2">
            <Layers className="w-7 h-7 shrink-0" /> Saved Library
          </h1>
          <p className="font-base text-xs opacity-90">
            Quickly access your saved album cards, trigger AI insights, or search your collection.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="neutral"
            className="font-heading uppercase text-xs px-3 py-1.5 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-background text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-main fill-main inline-block" />
            {totalElements ?? savedAlbums.length}{" "}
            {(totalElements ?? savedAlbums.length) === 1 ? "Album" : "Albums"} Saved
          </Badge>
        </div>
      </div>

      {/* TOP CONTROLS: Search Bar & Top Pagination */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search saved albums by title, artist, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 font-base text-sm border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Top Pagination Bar */}
        {!searchQuery && totalPages > 1 && (
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <span className="font-heading text-xs text-muted-foreground uppercase whitespace-nowrap">
              Page {currentPage + 1} of {totalPages}
            </span>
            {renderPagination()}
          </div>
        )}
      </div>

      {/* Album Cards Grid / Loading / Empty States */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 border-2 border-dashed border-border rounded-base">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-main" />
            <p className="font-heading text-xs uppercase text-muted-foreground">
              Loading library...
            </p>
          </div>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="p-8 text-center border-2 border-border rounded-base bg-background shadow-sm space-y-2">
          <p className="font-heading text-base uppercase">
            {searchQuery ? "No matching albums found" : "No saved albums found"}
          </p>
          <p className="font-base text-xs text-muted-foreground">
            {searchQuery
              ? `No albums in your saved library match "${searchQuery}".`
              : "Explore the catalog to add albums to your personal vault."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <SavedAlbumCard
              key={album.id}
              album={album}
              aiInsight={aiInsightMap[album.id] || null}
              aiLoadingId={aiLoadingId}
              onTriggerAiInsights={onTriggerAiInsights}
            />
          ))}
        </div>
      )}

      {/* BOTTOM CONTROLS: Bottom Pagination for convenience after scrolling */}
      {!searchQuery && totalPages > 1 && (
        <div className="flex items-center justify-between border-t-2 border-border pt-4 mt-6">
          <p className="font-heading text-xs text-muted-foreground uppercase">
            Page {currentPage + 1} of {totalPages}
          </p>
          {renderPagination()}
        </div>
      )}
    </section>
  );
}
