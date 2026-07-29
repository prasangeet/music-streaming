package com.musiccatalog.ai.service;

import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.ai.dto.LibraryInsightsResponse;

public interface AIService {

    AlbumInsightsResponse generateAlbumInsights(Long albumId);

    AlbumInsightsResponse refreshAlbumInsights(Long albumId);

    LibraryInsightsResponse generateLibraryInsights();
}
