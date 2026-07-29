"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CatalogExplorer } from "@/components/dashboard/CatalogExplorer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ItunesAlbumDto, ApiError } from "@/types";
import { searchAlbums, saveAlbum, getAlbums } from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function ExplorePage() {
  const router = useRouter();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ItunesAlbumDto[]>([]);

  // Saved Collection IDs Set/Array for Quick Lookup
  const [savedCollectionIds, setSavedCollectionIds] = useState<Set<number>>(
    new Set()
  );

  // Fetch saved albums on mount to track saved state
  useEffect(() => {
    const fetchSavedAlbums = async () => {
      try {
        const response = await getAlbums();
        const savedIds = new Set<number>(
          (response.content ?? [])
            .map((album) => album.appleCatalogId)
            .filter((id): id is number => id !== null && id !== undefined)
        );
        setSavedCollectionIds(savedIds);
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;
        if (err.response?.status === 401) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
        }
      }
    };

    fetchSavedAlbums();
  }, [router]);

  // Action Handlers
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.warning("Please enter a search term.");
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchAlbums(searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        toast.info("No albums found for your query.");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;
      toast.error(err.response?.data?.message ?? "Failed to search albums.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveItunesAlbum = async (itunesAlbum: ItunesAlbumDto) => {
    const toastId = toast.loading("Saving album to your library...");

    try {
      await saveAlbum(itunesAlbum.collectionId);

      // Optimistically update saved IDs set
      setSavedCollectionIds((prev) => new Set(prev).add(itunesAlbum.collectionId));

      toast.success("Album saved successfully!", { id: toastId });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;
      toast.error(err.response?.data?.message ?? "Failed to save album.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="font-heading uppercase text-xs">
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="size-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-heading uppercase text-xs">
              Explore Catalog
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Catalog Explorer */}
      <CatalogExplorer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        savedCollectionIds={savedCollectionIds}
        onSearch={handleSearch}
        onSaveAlbum={handleSaveItunesAlbum}
      />
    </div>
  );
}
