"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalyticsQuickNav } from "@/components/dashboard/AnalyticsQuickNav";
import { SavedAlbumCard } from "@/components/dashboard/SavedAlbumCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Loader2, LayoutDashboard, Sparkles, Layers, ArrowRight } from "lucide-react";
import { AlbumResponse, AlbumInsightsResponse, ApiError } from "@/types";
import { getAlbums, getAlbumInsights } from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function OverviewPage() {
  const router = useRouter();

  // Overview Data State
  const [savedAlbums, setSavedAlbums] = useState<AlbumResponse[]>([]);
  const [totalSavedCount, setTotalSavedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // AI Insights State
  const [aiLoadingId, setAiLoadingId] = useState<number | null>(null);
  const [aiInsightMap, setAiInsightMap] = useState<
    Record<number, AlbumInsightsResponse>
  >({});

  // Fetch initial saved albums on mount (fetch first page with up to 6 items)
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsLoading(true);
        // Fetching page 0 with size 6 for recent additions
        const albumsPage = await getAlbums({ page: 0, size: 6 });
        setSavedAlbums(albumsPage.content ?? []);
        setTotalSavedCount(albumsPage.totalElements ?? (albumsPage.content?.length || 0));
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.status === 401) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
          return;
        }

        toast.error(
          err.response?.data?.message ?? "Failed to load library overview."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, [router]);

  // Action Handlers
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

  const handleNavigateAnalytics = (tabParam?: string) => {
    if (tabParam) {
      router.push(`/dashboard/analytics?tab=${tabParam}`);
    } else {
      router.push("/dashboard/analytics");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-heading uppercase text-xs">
              Overview
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Banner */}
      <div className="bg-[var(--chart-3)] text-black p-6 rounded-base border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-black text-white font-heading text-xs mb-1 border border-border">
            DASHBOARD OVERVIEW ⚡
          </Badge>
          <h1 className="text-3xl font-heading uppercase flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7" /> Vault Control Center
          </h1>
          <p className="font-base text-xs opacity-90">
            Quick metrics, analytics shortcuts, and recent additions to your audio vault.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="neutral"
            className="font-heading uppercase text-xs px-3 py-1.5 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-background text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-main fill-main inline-block" />
            {totalSavedCount} Saved Items
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-main" />
          <p className="font-heading text-sm text-muted-foreground uppercase tracking-wider">
            Loading overview...
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Quick Nav to Analytics */}
          <AnalyticsQuickNav onNavigateAnalytics={handleNavigateAnalytics} />

          {/* Recent Saved Albums Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-main" />
                <h2 className="font-heading uppercase text-lg text-foreground">
                  Recently Saved Albums
                </h2>
                <Badge
                  variant="neutral"
                  className="font-heading text-xs border border-border"
                >
                  Max 6
                </Badge>
              </div>

              <Button
                asChild
                variant="neutral"
                size="sm"
                className="font-heading text-xs uppercase border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] gap-1.5"
              >
                <Link href="/dashboard/saved">
                  View All Library ({totalSavedCount})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {savedAlbums.length === 0 ? (
              <div className="p-8 text-center border-2 border-border rounded-base bg-background shadow-sm space-y-3">
                <p className="font-heading text-sm uppercase">No saved albums yet</p>
                <p className="font-base text-xs text-muted-foreground">
                  Explore the iTunes catalog to start building your local audio vault.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="font-heading uppercase text-xs border-2 border-border mt-2"
                >
                  <Link href="/dashboard/explore">Explore Catalog</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedAlbums.slice(0, 6).map((album) => (
                  <SavedAlbumCard
                    key={album.id}
                    album={album}
                    aiInsight={aiInsightMap[album.id] || null}
                    aiLoadingId={aiLoadingId}
                    onTriggerAiInsights={handleTriggerAiInsights}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
