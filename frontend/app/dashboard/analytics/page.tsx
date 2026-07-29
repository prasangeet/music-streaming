"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart as PieIcon,
  User,
  Calendar,
  Star,
  BarChart3,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  GenreAnalyticsResponse,
  ArtistAnalyticsResponse,
  ReleaseYearAnalyticsResponse,
  RatingAnalyticsResponse,
  LibraryInsightsResponse,
  ApiError,
} from "@/types";
import {
  getGenreAnalytics,
  getArtistAnalytics,
  getReleaseAnalytics,
  getRatingAnalytics,
  generateLibraryInsights,
} from "@/api";
import { removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

type TabType = "all" | "genres" | "artists" | "releases" | "ratings";

const GENRE_COLORS = [
  "var(--main)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
];

const artistConfig = {
  count: { label: "Count", color: "var(--chart-2)" },
} satisfies ChartConfig;

const releaseConfig = {
  count: { label: "Count", color: "var(--chart-4)" },
} satisfies ChartConfig;

const ratingConfig = {
  count: { label: "Count", color: "#f59e0b" },
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderTruncatedYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const rawText = String(payload.value ?? "");
  const maxLength = 16;
  const truncatedText =
    rawText.length > maxLength
      ? `${rawText.substring(0, maxLength)}...`
      : rawText;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={4}
        textAnchor="end"
        fill="currentColor"
        className="font-heading text-[11px] fill-foreground"
      >
        <title>{rawText}</title>
        {truncatedText}
      </text>
    </g>
  );
};

// Custom Pie Label showing percentage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, genre } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.04) return null; // Hide tiny slice labels to prevent overlap

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-heading text-[10px] fill-foreground font-bold"
    >
      {`${genre} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

function AnalyticsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [genres, setGenres] = useState<GenreAnalyticsResponse[]>([]);
  const [artists, setArtists] = useState<ArtistAnalyticsResponse[]>([]);
  const [releases, setReleases] = useState<ReleaseYearAnalyticsResponse[]>([]);
  const [ratings, setRatings] = useState<RatingAnalyticsResponse[]>([]);
  const [libraryInsights, setLibraryInsights] =
    useState<LibraryInsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingInsights, setIsGeneratingInsights] =
    useState<boolean>(false);

  const rawTab = searchParams.get("tab")?.toLowerCase();
  const validTabs: TabType[] = ["genres", "artists", "releases", "ratings"];
  const activeTab: TabType = validTabs.includes(rawTab as TabType)
    ? (rawTab as TabType)
    : "all";

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setIsLoading(true);

        const [genresData, artistsData, releasesData, ratingsData] =
          await Promise.all([
            getGenreAnalytics(),
            getArtistAnalytics(),
            getReleaseAnalytics(),
            getRatingAnalytics(),
          ]);

        setGenres(genresData ?? []);
        setArtists(artistsData ?? []);
        setReleases(releasesData ?? []);
        setRatings(ratingsData ?? []);
      } catch (error: unknown) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.status === 401) {
          removeToken();
          toast.error("Your session has expired. Please login again.");
          router.replace("/login");
          return;
        }

        toast.error(
          err.response?.data?.message ?? "Failed to load catalog analytics."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAnalytics();
  }, [router]);

  const handleTabSelect = (tab: TabType) => {
    if (tab === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?tab=${tab}`);
    }
  };

  const handleGenerateLibraryInsights = async () => {
    try {
      setIsGeneratingInsights(true);
      const insights = await generateLibraryInsights();
      setLibraryInsights(insights);
      toast.success("AI library insights generated.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate AI library insights."
      );
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const genreChartData = genres.map((item, index) => ({
    genre: item.genre ?? "Unspecified",
    count: item.count ?? 0,
    fill: GENRE_COLORS[index % GENRE_COLORS.length],
  }));

  const totalGenreCount = genreChartData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const genreConfig = genres.reduce<ChartConfig>(
    (acc, item, index) => {
      const key = (item.genre ?? "Unspecified")
        .toLowerCase()
        .replace(/\s+/g, "_");
      acc[key] = {
        label: item.genre ?? "Unspecified",
        color: GENRE_COLORS[index % GENRE_COLORS.length],
      };
      return acc;
    },
    { count: { label: "Count" } }
  );

  const formattedRatingData = ratings.map((item) => ({
    ratingLabel: `${item.rating ?? 0} Star${item.rating === 1 ? "" : "s"}`,
    count: item.count ?? 0,
  }));

  const topArtists = artists.slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-main" />
        <p className="font-heading text-xs text-muted-foreground uppercase tracking-wider">
          Loading catalog analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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
              Analytics {activeTab !== "all" && `— ${activeTab}`}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Banner */}
      <div className="bg-[var(--chart-3)] text-black p-6 rounded-base border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-black text-white font-heading text-xs mb-1 border border-border">
            CATALOG ANALYTICS 📊
          </Badge>
          <h1 className="text-3xl font-heading uppercase flex items-center gap-2">
            <BarChart3 className="w-7 h-7" /> Library Breakdown
          </h1>
          <p className="font-base text-xs opacity-90">
            Visualized metrics across genres, top artists, release eras, and rating distributions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(["all", "genres", "artists", "releases", "ratings"] as const).map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "neutral"}
                size="sm"
                onClick={() => handleTabSelect(tab)}
                className="font-heading uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {tab}
              </Button>
            )
          )}
        </div>
      </div>

      {/* AI Library Insights */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[var(--chart-4)]/10">
        <CardHeader className="p-5 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="font-heading uppercase text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-main" /> AI Library Insights
              </CardTitle>
              <CardDescription className="font-base text-xs mt-1">
                Generate a qualitative trend summary from your saved albums, ratings, genres, artists, and release eras.
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateLibraryInsights}
              disabled={isGeneratingInsights}
              className="font-heading uppercase text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
            >
              {isGeneratingInsights ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {libraryInsights ? "Refresh Insights" : "Generate Insights"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {libraryInsights ? (
            <div className="space-y-5">
              <div className="p-4 border-2 border-border rounded-base bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-heading uppercase text-xs text-muted-foreground mb-2">
                  AI Summary
                </h3>
                <p className="font-base text-sm leading-relaxed">
                  {libraryInsights.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  ["Dominant Genres", libraryInsights.dominantGenres],
                  ["Listening Personality", libraryInsights.listeningPersonality],
                  ["Trend Highlights", libraryInsights.trendHighlights],
                  ["Recommendations", libraryInsights.recommendations],
                  ["Discovery Suggestions", libraryInsights.discoverySuggestions],
                ].map(([title, items]) => (
                  <div
                    key={title as string}
                    className="p-4 border-2 border-border rounded-base bg-background min-h-36"
                  >
                    <h3 className="font-heading uppercase text-xs mb-3">
                      {title as string}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).length > 0 ? (
                        (items as string[]).map((item, index) => (
                          <Badge
                            key={`${title}-${index}`}
                            variant="neutral"
                            className="font-base text-xs border border-border whitespace-normal text-left"
                          >
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <p className="font-base text-xs text-muted-foreground">
                          No insight generated for this category.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 border-2 border-dashed border-border rounded-base bg-background gap-3">
              <Sparkles className="w-10 h-10 text-main" />
              <div className="space-y-1 max-w-lg">
                <p className="font-heading uppercase text-sm">
                  Generate AI-powered analytics from your saved library
                </p>
                <p className="font-base text-xs text-muted-foreground leading-relaxed">
                  This summarizes your catalog patterns beyond charts: dominant styles, listening personality, release-era trends, and discovery recommendations.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Genre Breakdown (Detailed Pie Chart) */}
        {(activeTab === "all" || activeTab === "genres") && (
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <CardHeader className="p-5 border-b-2 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading uppercase text-lg flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-main" /> Genre Breakdown
                </CardTitle>
                <Badge variant="neutral" className="text-[10px] font-heading border border-border">
                  {genres.length} Genres
                </Badge>
              </div>
              <CardDescription className="font-base text-xs">
                Detailed proportional breakdown of primary genres across your catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col items-center justify-center">
              {genreChartData.length === 0 ? (
                <div className="py-12 text-xs font-base text-muted-foreground text-center">
                  No genre data available.
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-4">
                  <ChartContainer
                    config={genreConfig}
                    className="min-h-[340px] w-full max-w-[440px] relative"
                  >
                    <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={genreChartData}
                        dataKey="count"
                        nameKey="genre"
                        innerRadius={65}
                        outerRadius={95}
                        strokeWidth={2}
                        stroke="var(--border)"
                        label={renderCustomPieLabel}
                        labelLine={false}
                      >
                        {genreChartData.map((entry, index) => (
                          <Cell key={`genre-cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>

                      {/* Donut Hole Center Summary */}
                      <text
                        x="50%"
                        y="46%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-heading text-2xl font-bold fill-foreground"
                      >
                        {totalGenreCount}
                      </text>
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-heading text-[10px] uppercase fill-muted-foreground tracking-wider"
                      >
                        Total Items
                      </text>

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: string, entry: any) => {
                          const item = genreChartData.find(
                            (g) => g.genre === value
                          );
                          return (
                            <span className="font-heading text-[11px] text-foreground inline-flex items-center gap-1.5 mr-3">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-border inline-block"
                                style={{ backgroundColor: entry.color }}
                              />
                              {value} ({item?.count ?? 0})
                            </span>
                          );
                        }}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 2. Top Artists (Limited to Top 8) */}
        {(activeTab === "all" || activeTab === "artists") && (
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="p-5 border-b-2 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading uppercase text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--chart-2)]" /> Top Artists
                </CardTitle>
                <Badge variant="neutral" className="text-[10px] font-heading border border-border">
                  TOP {topArtists.length}
                </Badge>
              </div>
              <CardDescription className="font-base text-xs">
                Most frequent artists in your collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {topArtists.length === 0 ? (
                <div className="py-12 text-xs font-base text-muted-foreground text-center">
                  No artist data available.
                </div>
              ) : (
                <ChartContainer
                  config={artistConfig}
                  className="min-h-[340px] w-full"
                >
                  <BarChart
                    data={topArtists}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="artistName"
                      type="category"
                      width={120}
                      tick={renderTruncatedYAxisTick}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--chart-2)"
                      radius={4}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* 3. Release Eras */}
        {(activeTab === "all" || activeTab === "releases") && (
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="p-5 border-b-2 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading uppercase text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--chart-4)]" />{" "}
                  Release Eras
                </CardTitle>
                <Badge variant="neutral" className="text-[10px] font-heading border border-border">
                  GET /analytics/releases
                </Badge>
              </div>
              <CardDescription className="font-base text-xs">
                Distribution of entries across release years.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {releases.length === 0 ? (
                <div className="py-12 text-xs font-base text-muted-foreground text-center">
                  No release year data available.
                </div>
              ) : (
                <ChartContainer
                  config={releaseConfig}
                  className="min-h-[280px] w-full"
                >
                  <BarChart data={releases}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--chart-4)"
                      radius={4}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* 4. Rating Histogram */}
        {(activeTab === "all" || activeTab === "ratings") && (
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="p-5 border-b-2 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading uppercase text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />{" "}
                  Rating Histogram
                </CardTitle>
                <Badge variant="neutral" className="text-[10px] font-heading border border-border">
                  GET /analytics/ratings
                </Badge>
              </div>
              <CardDescription className="font-base text-xs">
                Score breakdown across saved items.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {formattedRatingData.length === 0 ? (
                <div className="py-12 text-xs font-base text-muted-foreground text-center">
                  No rating data available.
                </div>
              ) : (
                <ChartContainer
                  config={ratingConfig}
                  className="min-h-[280px] w-full"
                >
                  <BarChart data={formattedRatingData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="ratingLabel" tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="count"
                      fill="#f59e0b"
                      radius={4}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-main" />
          <p className="font-heading text-xs text-muted-foreground uppercase tracking-wider">
            Loading analytics...
          </p>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
