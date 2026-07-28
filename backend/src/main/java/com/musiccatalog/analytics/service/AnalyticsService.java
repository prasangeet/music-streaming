package com.musiccatalog.analytics.service;

import com.musiccatalog.analytics.dto.ArtistAnalyticsResponse;
import com.musiccatalog.analytics.dto.GenreAnalyticsResponse;
import com.musiccatalog.analytics.dto.RatingAnalyticsResponse;
import com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse;
import java.util.List;

public interface AnalyticsService {

    List<GenreAnalyticsResponse> getGenreStatistics();

    List<ArtistAnalyticsResponse> getArtistStatistics();

    List<RatingAnalyticsResponse> getRatingStatistics();

    List<ReleaseYearAnalyticsResponse> getReleaseYearStatistics();
}
