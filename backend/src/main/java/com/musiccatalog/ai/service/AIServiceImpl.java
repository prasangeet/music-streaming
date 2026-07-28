package com.musiccatalog.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.ai.client.GeminiClient;
import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.album.entity.Album;
import com.musiccatalog.album.repository.AlbumRepository;
import com.musiccatalog.common.exception.ai.AIException;
import com.musiccatalog.common.exception.album.AlbumNotFoundException;
import com.musiccatalog.security.currentuser.CurrentUserService;
import com.musiccatalog.user.entity.User;
import java.time.Instant;
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
