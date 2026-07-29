"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlbumHeroBanner } from "@/components/album-detail/AlbumHeroBanner";
import { AiInsightsCard } from "@/components/album-detail/AiInsightsCard";
import { UserNotesCard } from "@/components/album-detail/UserNotesCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2, ChevronRight } from "lucide-react";
import { AlbumResponse, AlbumInsightsResponse, ApiError } from "@/types";
import {
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  getAlbumInsights,
  refreshAlbumInsights,
} from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const albumId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  // State
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [aiInsight, setAiInsight] = useState<AlbumInsightsResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // 1. Updated state to support nullable ratings
  const [rating, setRating] = useState<number | null>(null);
  const [userNotes, setUserNotes] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

  // Load Album & AI Insights on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const albumData = await getAlbumById(albumId);
        setAlbum(albumData);

        // 2. Directly assign userRating (supports number or null)
        setRating(albumData.userRating);
        setUserNotes(albumData.userNotes ?? "");

        try {
          const insightsData = await getAlbumInsights(albumId);
          setAiInsight(insightsData);
        } catch {
          setAiInsight(null);
        }
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.status === 401) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
          return;
        }

        toast.error(
          err.response?.data?.message ?? "Failed to load album details."
        );
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(albumId)) {
      fetchData();
    }
  }, [albumId, router]);

  // Handler: Toggle Favourite Status
  const handleToggleFavourite = async () => {
    if (!album) return;
    const newFavStatus = !album.favourite;

    // Optimistic UI update
    setAlbum((prev) => (prev ? { ...prev, favourite: newFavStatus } : null));

    try {
      // 3. Sends rating as number | null
      const updated = await updateAlbum(album.id, {
        userRating: rating,
        userNotes: userNotes,
        favourite: newFavStatus,
      });
      setAlbum(updated);
      toast.success(
        newFavStatus ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error: unknown) {
      // Revert optimistic update
      setAlbum((prev) => (prev ? { ...prev, favourite: !newFavStatus } : null));
      const err = error as AxiosError<ApiError>;
      toast.error(
        err.response?.data?.message ?? "Failed to update favorite status."
      );
    }
  };

  // Handler: Update User Rating
  const handleRatingChange = async (newRating: number | null) => {
    if (!album) return;

    // Optimistic UI update
    setRating(newRating);
    setAlbum((prev) => (prev ? { ...prev, userRating: newRating } : null));

    try {
      // 3. Sends newRating as number | null
      const updated = await updateAlbum(album.id, {
        userRating: newRating,
        userNotes: userNotes,
        favourite: album.favourite,
      });
      setAlbum(updated);
      toast.success("Rating updated!");
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;
      toast.error(err.response?.data?.message ?? "Failed to update rating.");
    }
  };

  // Handler: Save User Notes
  const handleSaveNotes = async () => {
    if (!album) return;

    try {
      // 3. Sends rating as number | null
      const updated = await updateAlbum(album.id, {
        userRating: rating,
        userNotes: userNotes,
        favourite: album.favourite,
      });
      setAlbum(updated);
      setIsEditingNotes(false);
      toast.success("Notes saved successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;
      toast.error(err.response?.data?.message ?? "Failed to save notes.");
    }
  };

  // Handler: Refresh/Generate AI Insights
  const handleGenerateAiInsight = async () => {
    if (!album) return;
    setIsGeneratingAi(true);

    const toastId = toast.loading("Generating AI audio insights...");

    try {
      const insights = await refreshAlbumInsights(album.id);
      setAiInsight(insights);
      toast.success("AI insights updated!", { id: toastId });
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;
      toast.error(
        err.response?.data?.message ?? "Failed to generate AI insights.",
        { id: toastId }
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handler: Delete Album
  const handleDeleteAlbum = async () => {
    if (!album) return;

    if (
      confirm(
        `Are you sure you want to remove "${album.title}" from your catalog?`
      )
    ) {
      const toastId = toast.loading("Deleting album...");
      try {
        await deleteAlbum(album.id);
        toast.success("Album deleted successfully", { id: toastId });
        router.push("/dashboard");
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;
        toast.error(err.response?.data?.message ?? "Failed to delete album.", {
          id: toastId,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-main" />
        <p className="font-heading text-xs text-muted-foreground uppercase tracking-wider">
          Loading album details...
        </p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="font-heading text-xl uppercase">Album Not Found</h2>
        <p className="font-base text-xs text-muted-foreground">
          The requested album could not be found in your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
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
              <Link href="/dashboard/saved" className="font-heading uppercase text-xs">
                Saved
              </Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="size-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-heading uppercase text-xs">
              {album.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className="space-y-8">
        {/* Album Hero Banner */}
        <AlbumHeroBanner
          album={album}
          rating={rating}
          isGeneratingAi={isGeneratingAi}
          onToggleFavourite={handleToggleFavourite}
          onRatingChange={handleRatingChange}
          onGenerateAiInsight={handleGenerateAiInsight}
        />

        {/* AI Insights Card */}
        <AiInsightsCard
          aiInsight={aiInsight}
          isGeneratingAi={isGeneratingAi}
          onGenerateAiInsight={handleGenerateAiInsight}
        />

        {/* User Notes Section */}
        <UserNotesCard
          notes={userNotes}
          setNotes={setUserNotes}
          isEditing={isEditingNotes}
          setIsEditing={setIsEditingNotes}
          onSave={handleSaveNotes}
        />
      </main>
    </div>
  );
}
