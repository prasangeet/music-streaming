package com.musiccatalog.ai.client;

import com.musiccatalog.ai.dto.AlbumInsightsResponse;

public interface GeminiClient {

    AlbumInsightsResponse generateAlbumInsights(
            String title,
            String artist,
            String genre
    );
}
