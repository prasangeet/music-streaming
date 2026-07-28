package com.musiccatalog.analytics.repository;

import com.musiccatalog.analytics.dto.ArtistAnalyticsResponse;
import com.musiccatalog.analytics.dto.GenreAnalyticsResponse;
import com.musiccatalog.analytics.dto.RatingAnalyticsResponse;
import com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse;
import com.musiccatalog.user.entity.User;
import java.util.List;

public interface AnalyticsRepository {

    List<GenreAnalyticsResponse> getGenreStatistics(User user);

    List<ArtistAnalyticsResponse> getArtistStatistics(User user);

    List<RatingAnalyticsResponse> getRatingStatistics(User user);

    List<ReleaseYearAnalyticsResponse> getReleaseYearStatistics(User user);
}
