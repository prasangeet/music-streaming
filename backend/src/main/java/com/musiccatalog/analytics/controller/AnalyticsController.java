package com.musiccatalog.analytics.controller;

import com.musiccatalog.analytics.dto.ArtistAnalyticsResponse;
import com.musiccatalog.analytics.dto.GenreAnalyticsResponse;
import com.musiccatalog.analytics.dto.RatingAnalyticsResponse;
import com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse;
import com.musiccatalog.analytics.service.AnalyticsService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/genres")
    public ResponseEntity<List<GenreAnalyticsResponse>> getGenreStatistics() {
        return ResponseEntity.ok(
                analyticsService.getGenreStatistics()
        );
    }

    @GetMapping("/artists")
    public ResponseEntity<List<ArtistAnalyticsResponse>> getArtistStatistics() {
        return ResponseEntity.ok(
                analyticsService.getArtistStatistics()
        );
    }

    @GetMapping("/ratings")
    public ResponseEntity<List<RatingAnalyticsResponse>> getRatingStatistics() {
        return ResponseEntity.ok(
                analyticsService.getRatingStatistics()
        );
    }

    @GetMapping("/releases")
    public ResponseEntity<List<ReleaseYearAnalyticsResponse>> getReleaseYearStatistics() {
        return ResponseEntity.ok(
                analyticsService.getReleaseYearStatistics()
        );
    }
}
