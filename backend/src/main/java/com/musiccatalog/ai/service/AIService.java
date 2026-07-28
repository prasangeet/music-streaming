package com.musiccatalog.ai.service;

import com.musiccatalog.ai.dto.AlbumInsightsResponse;

public interface AIService {

    AlbumInsightsResponse generateAlbumInsights(Long albumId);

    AlbumInsightsResponse refreshAlbumInsights(Long albumId);
}
