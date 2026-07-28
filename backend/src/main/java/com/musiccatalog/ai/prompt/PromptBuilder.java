package com.musiccatalog.ai.prompt;

public final class PromptBuilder {

    private PromptBuilder() {
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
