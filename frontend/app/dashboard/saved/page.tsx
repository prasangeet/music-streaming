"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { SavedLibrary } from "@/components/dashboard/SavedLibrary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlbumResponse, AlbumInsightsResponse, ApiError } from "@/types";
import { getAlbums, getAlbumInsights } from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

const PAGE_SIZE = 12;

export default function SavedLibraryPage() {
  const router = useRouter();

  const [savedAlbums, setSavedAlbums] = useState<AlbumResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // AI Insights State
  const [aiLoadingId, setAiLoadingId] = useState<number | null>(null);
  const [aiInsightMap, setAiInsightMap] = useState<
    Record<number, AlbumInsightsResponse>
  >({});

  useEffect(() => {
    const fetchSavedAlbums = async () => {
      try {
        setIsLoading(true);

        const pageData = await getAlbums({
          page: currentPage,
          size: PAGE_SIZE,
        });

        setSavedAlbums(pageData.content ?? []);
        setTotalPages(pageData.totalPages ?? 0);
        setTotalElements(pageData.totalElements ?? 0);
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.status === 401) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
          return;
        }

        toast.error(
          err.response?.data?.message ?? "Failed to load saved library."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedAlbums();
  }, [router, currentPage]);

  const handleTriggerAiInsights = async (
    albumId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    setAiLoadingId(albumId);

    const toastId = toast.loading("Generating AI insights...");

    try {
      const insights = await getAlbumInsights(albumId);

      setAiInsightMap((prev) => ({
        ...prev,
        [albumId]: insights,
      }));

      toast.success("AI insights ready!", { id: toastId });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;

      toast.error(
        err.response?.data?.message ?? "Failed to generate AI insights.",
        { id: toastId }
      );
    } finally {
      setAiLoadingId(null);
    }
  };

  if (isLoading && savedAlbums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-main" />
        <p className="font-heading text-sm text-muted-foreground uppercase tracking-wider">
          Loading your library...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Saved Library
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SavedLibrary
        savedAlbums={savedAlbums}
        aiInsightMap={aiInsightMap}
        aiLoadingId={aiLoadingId}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        isLoading={isLoading}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        onTriggerAiInsights={handleTriggerAiInsights}
      />
    </div>
  );
}
