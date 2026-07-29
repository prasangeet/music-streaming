"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlbumInsightsResponse } from "@/types";
import { Sparkles, Disc, Tag, Compass, Lightbulb, Users, RefreshCw } from "lucide-react";

interface AiInsightsCardProps {
  aiInsight?: AlbumInsightsResponse | null;
  isGeneratingAi: boolean;
  onGenerateAiInsight: () => void;
}

export function AiInsightsCard({
  aiInsight,
  isGeneratingAi,
  onGenerateAiInsight,
}: AiInsightsCardProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-border pb-2">
        <h2 className="font-heading uppercase text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-main" /> AI Insights Engine
        </h2>
      </div>

      <Card className="border-2 border-border shadow-[var(--shadow)] bg-[var(--chart-4)]/10">
        <CardContent className="p-6">
          {aiInsight ? (
            <div className="space-y-6">
              {/* Summary */}
              {aiInsight.summary && (
                <div>
                  <h3 className="font-heading text-xs uppercase text-foreground/60 mb-1">
                    Overview Summary
                  </h3>
                  <p className="font-base text-base leading-relaxed">{aiInsight.summary}</p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                {/* Moods */}
                {aiInsight.moods && aiInsight.moods.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Tag className="w-4 h-4 mt-0.5 text-main flex-shrink-0" />
                    <div className="space-y-1.5">
                      <span className="font-heading text-xs uppercase block text-foreground/70">
                        Moods
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.moods.map((mood, idx) => (
                          <Badge key={idx} variant="neutral" className="text-xs font-base">
                            {mood}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Themes */}
                {aiInsight.themes && aiInsight.themes.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 mt-0.5 text-main flex-shrink-0" />
                    <div className="space-y-1.5">
                      <span className="font-heading text-xs uppercase block text-foreground/70">
                        Themes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.themes.map((theme, idx) => (
                          <Badge key={idx} variant="neutral" className="text-xs font-base">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended For */}
                {aiInsight.recommendedFor && aiInsight.recommendedFor.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 mt-0.5 text-main flex-shrink-0" />
                    <div className="space-y-1.5">
                      <span className="font-heading text-xs uppercase block text-foreground/70">
                        Recommended For
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.recommendedFor.map((rec, idx) => (
                          <Badge key={idx} variant="neutral" className="text-xs font-base">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Similar Artists */}
                {aiInsight.similarArtists && aiInsight.similarArtists.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 mt-0.5 text-main flex-shrink-0" />
                    <div className="space-y-1.5">
                      <span className="font-heading text-xs uppercase block text-foreground/70">
                        Similar Artists
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInsight.similarArtists.map((artist, idx) => (
                          <Badge key={idx} variant="neutral" className="text-xs font-base">
                            {artist}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <Disc
                className={`w-10 h-10 text-foreground/30 ${
                  isGeneratingAi ? "animate-spin" : ""
                }`}
                style={isGeneratingAi ? { animationDuration: "3s" } : undefined}
              />
              <p className="font-base text-sm text-foreground/70">
                {isGeneratingAi
                  ? "Analyzing album insights with AI..."
                  : "No AI analysis has been generated for this album yet."}
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={onGenerateAiInsight}
                disabled={isGeneratingAi}
                className="font-heading text-xs uppercase gap-1.5"
              >
                {isGeneratingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isGeneratingAi ? "Analyzing..." : "Generate AI Insights"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
