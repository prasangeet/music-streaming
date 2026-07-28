package com.musiccatalog.analytics.service;

import com.musiccatalog.analytics.dto.ArtistAnalyticsResponse;
import com.musiccatalog.analytics.dto.GenreAnalyticsResponse;
import com.musiccatalog.analytics.dto.RatingAnalyticsResponse;
import com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse;
import com.musiccatalog.analytics.repository.AnalyticsRepository;
import com.musiccatalog.security.currentuser.CurrentUserService;
import com.musiccatalog.user.entity.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final CurrentUserService currentUserService;

    @Override
    public List<GenreAnalyticsResponse> getGenreStatistics() {

        User currentUser = currentUserService.getCurrentUser();

        return analyticsRepository.getGenreStatistics(currentUser);
    }

    @Override
    public List<ArtistAnalyticsResponse> getArtistStatistics() {

        User currentUser = currentUserService.getCurrentUser();

        return analyticsRepository.getArtistStatistics(currentUser);
    }

    @Override
    public List<RatingAnalyticsResponse> getRatingStatistics() {

        User currentUser = currentUserService.getCurrentUser();

        return analyticsRepository.getRatingStatistics(currentUser);
    }

    @Override
    public List<ReleaseYearAnalyticsResponse> getReleaseYearStatistics() {

        User currentUser = currentUserService.getCurrentUser();

        return analyticsRepository.getReleaseYearStatistics(currentUser);
    }
}
