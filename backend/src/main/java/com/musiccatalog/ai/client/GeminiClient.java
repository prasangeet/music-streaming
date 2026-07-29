package com.musiccatalog.ai.client;

import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.ai.dto.LibraryInsightsResponse;

public interface GeminiClient {

    AlbumInsightsResponse generateAlbumInsights(
            String title,
            String artist,
            String genre
    );

    LibraryInsightsResponse generateLibraryInsights(String librarySnapshot);
}
