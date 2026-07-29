package com.musiccatalog.ai.prompt;

public final class PromptBuilder {

    private PromptBuilder() {
    }

    public static String libraryInsightsPrompt(String librarySnapshot) {
        return """
                You are an expert music analyst for a streaming platform.

                Analyze this user's saved album library and produce high-level catalog insights.
                Focus on genre balance, release-era patterns, rating behavior, artist repetition,
                and practical discovery recommendations.

                Library snapshot:
                %s

                Return ONLY a JSON object with these fields:

                {
                  "summary": "string",
                  "dominantGenres": ["string"],
                  "listeningPersonality": ["string"],
                  "trendHighlights": ["string"],
                  "recommendations": ["string"],
                  "discoverySuggestions": ["string"]
                }
                """
                .formatted(librarySnapshot);
    }

    public static String albumInsightsPrompt(
            String title,
            String artist,
            String genre
    ) {
        return """
                You are an expert music critic.

                Analyze this album.

                Title: %s
                Artist: %s
                Genre: %s

                Return ONLY a JSON object with these fields:

                {
                  "summary": "string",
                  "moods": ["string"],
                  "themes": ["string"],
                  "recommendedFor": ["string"],
                  "similarArtists": ["string"]
                }
                """
                .formatted(title, artist, genre);
    }
}
