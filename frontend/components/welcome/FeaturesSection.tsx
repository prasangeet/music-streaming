import React from "react";
import { Search, BarChart3, Sparkles } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const FEATURES = [
  {
    title: "1. Public Search",
    description: "Query the iTunes Search API directly with live debounced search for artists, albums, or tracks.",
    icon: Search,
    iconBgClass: "bg-[var(--chart-2)] text-white",
  },
  {
    title: "2. Analytics",
    description: "Interactive distribution charts covering genre breakdown, release dates by year, and rating histograms.",
    icon: BarChart3,
    iconBgClass: "bg-main text-main-foreground",
  },
  {
    title: "3. AI Insights",
    description: "Leverage natural language queries or automated trend summarization to discover hidden patterns in your library.",
    icon: Sparkles,
    iconBgClass: "bg-[var(--chart-4)] text-black",
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-8">
      <div className="text-center bg-[var(--chart-3)] text-black py-3 border-2 border-border rounded-md shadow-sm">
        <h2 className="text-2xl md:text-3xl font-heading uppercase">
          Core Platform Capabilities
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </div>
    </section>
  );
}
