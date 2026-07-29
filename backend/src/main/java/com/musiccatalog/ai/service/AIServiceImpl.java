package com.musiccatalog.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.ai.client.GeminiClient;
import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.ai.dto.LibraryInsightsResponse;
import com.musiccatalog.album.entity.Album;
import com.musiccatalog.album.repository.AlbumRepository;
import com.musiccatalog.common.exception.ai.AIException;
import com.musiccatalog.common.exception.album.AlbumNotFoundException;
import com.musiccatalog.security.currentuser.CurrentUserService;
import com.musiccatalog.user.entity.User;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final AlbumRepository albumRepository;
    private final CurrentUserService currentUserService;
    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    @Override
    public AlbumInsightsResponse generateAlbumInsights(Long albumId) {

        Album album = getAlbumForCurrentUser(albumId);

        if (album.getAiGeneratedAt() != null) {
            return getCachedInsights(album);
        }

        return generateAndCacheInsights(album);
    }

    @Override
    public AlbumInsightsResponse refreshAlbumInsights(Long albumId) {

        Album album = getAlbumForCurrentUser(albumId);

        return generateAndCacheInsights(album);
    }

    @Override
    public LibraryInsightsResponse generateLibraryInsights() {

        User currentUser = currentUserService.getCurrentUser();
        List<Album> albums = albumRepository.findAllByUser(currentUser);

        if (albums.isEmpty()) {
            throw new AIException(
                    "Save at least one album before generating library insights."
            );
        }

        return geminiClient.generateLibraryInsights(
                buildLibrarySnapshot(albums)
        );
    }

    private String buildLibrarySnapshot(List<Album> albums) {

        String topGenres = summarizeCounts(
                albums.stream()
                        .map(Album::getGenre)
                        .filter(Objects::nonNull)
                        .filter(genre -> !genre.isBlank())
                        .collect(Collectors.groupingBy(
                                genre -> genre,
                                Collectors.counting()
                        ))
        );

        String topArtists = summarizeCounts(
                albums.stream()
                        .map(Album::getArtistName)
                        .filter(Objects::nonNull)
                        .filter(artist -> !artist.isBlank())
                        .collect(Collectors.groupingBy(
                                artist -> artist,
                                Collectors.counting()
                        ))
        );

        String releaseYears = summarizeCounts(
                albums.stream()
                        .map(Album::getReleaseDate)
                        .filter(Objects::nonNull)
                        .map(date -> String.valueOf(date.getYear()))
                        .collect(Collectors.groupingBy(
                                year -> year,
                                Collectors.counting()
                        ))
        );

        String ratings = summarizeCounts(
                albums.stream()
                        .map(Album::getUserRating)
                        .filter(Objects::nonNull)
                        .map(rating -> rating + " stars")
                        .collect(Collectors.groupingBy(
                                rating -> rating,
                                Collectors.counting()
                        ))
        );

        String albumRows = albums.stream()
                .sorted(Comparator.comparing(
                        Album::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(30)
                .map(album -> "- %s by %s | Genre: %s | Released: %s | Tracks: %s | Rating: %s | Favourite: %s"
                        .formatted(
                                nullToUnknown(album.getTitle()),
                                nullToUnknown(album.getArtistName()),
                                nullToUnknown(album.getGenre()),
                                album.getReleaseDate() == null
                                        ? "Unknown"
                                        : album.getReleaseDate().toString(),
                                album.getTrackCount() == null
                                        ? "Unknown"
                                        : album.getTrackCount().toString(),
                                album.getUserRating() == null
                                        ? "Unrated"
                                        : album.getUserRating().toString(),
                                Boolean.TRUE.equals(album.getFavourite())
                                        ? "Yes"
                                        : "No"
                        ))
                .collect(Collectors.joining("\n"));

        return """
                Total saved albums: %d
                Top genres: %s
                Top artists: %s
                Release years: %s
                User ratings: %s

                Recent saved albums sample:
                %s
                """
                .formatted(
                        albums.size(),
                        topGenres,
                        topArtists,
                        releaseYears,
                        ratings,
                        albumRows
                );
    }

    private String summarizeCounts(Map<String, Long> counts) {

        if (counts.isEmpty()) {
            return "No data";
        }

        return counts.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(8)
                .map(entry -> entry.getKey() + " (" + entry.getValue() + ")")
                .collect(Collectors.joining(", "));
    }

    private String nullToUnknown(String value) {
        return value == null || value.isBlank() ? "Unknown" : value;
    }

    private Album getAlbumForCurrentUser(Long albumId) {

        User currentUser = currentUserService.getCurrentUser();

        return albumRepository
                .findByIdAndUser(albumId, currentUser)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));
    }

    private AlbumInsightsResponse generateAndCacheInsights(Album album) {

        AlbumInsightsResponse insights = geminiClient.generateAlbumInsights(
                album.getTitle(),
                album.getArtistName(),
                album.getGenre()
        );

        cacheInsights(album, insights);

        return insights;
    }

    private AlbumInsightsResponse getCachedInsights(Album album) {

        try {
            return new AlbumInsightsResponse(
                    album.getAiSummary(),
                    objectMapper.readValue(
                            album.getAiMoods(),
                            new TypeReference<>() {}
                    ),
                    objectMapper.readValue(
                            album.getAiThemes(),
                            new TypeReference<>() {}
                    ),
                    objectMapper.readValue(
                            album.getAiRecommendedFor(),
                            new TypeReference<>() {}
                    ),
                    objectMapper.readValue(
                            album.getAiSimilarArtists(),
                            new TypeReference<>() {}
                    )
            );
        } catch (Exception ex) {
            throw new AIException(
                    "Failed to deserialize cached AI insights.",
                    ex
            );
        }
    }

    private void cacheInsights(
            Album album,
            AlbumInsightsResponse insights
    ) {

        try {
            album.setAiSummary(insights.getSummary());
            album.setAiMoods(
                    objectMapper.writeValueAsString(
                            insights.getMoods()
                    )
            );
            album.setAiThemes(
                    objectMapper.writeValueAsString(
                            insights.getThemes()
                    )
            );
            album.setAiRecommendedFor(
                    objectMapper.writeValueAsString(
                            insights.getRecommendedFor()
                    )
            );
            album.setAiSimilarArtists(
                    objectMapper.writeValueAsString(
                            insights.getSimilarArtists()
                    )
            );
            album.setAiGeneratedAt(Instant.now());

            albumRepository.save(album);

        } catch (Exception ex) {
            throw new AIException(
                    "Failed to cache AI insights.",
                    ex
            );
        }
    }
}
