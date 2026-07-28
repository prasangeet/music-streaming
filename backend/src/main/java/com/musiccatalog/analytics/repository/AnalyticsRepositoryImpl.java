package com.musiccatalog.analytics.repository;

import com.musiccatalog.analytics.dto.ArtistAnalyticsResponse;
import com.musiccatalog.analytics.dto.GenreAnalyticsResponse;
import com.musiccatalog.analytics.dto.RatingAnalyticsResponse;
import com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse;
import com.musiccatalog.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class AnalyticsRepositoryImpl implements AnalyticsRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<GenreAnalyticsResponse> getGenreStatistics(User user) {
        return entityManager.createQuery("""
            SELECT new com.musiccatalog.analytics.dto.GenreAnalyticsResponse(
                a.genre,
                COUNT(a)
            )
            FROM Album a
            WHERE a.user = :user
            GROUP BY a.genre
            ORDER BY COUNT(a) DESC
            """, GenreAnalyticsResponse.class)
            .setParameter("user", user)
            .getResultList();
    }

    @Override
    public List<ArtistAnalyticsResponse> getArtistStatistics(User user) {
        return entityManager.createQuery("""
            SELECT new com.musiccatalog.analytics.dto.ArtistAnalyticsResponse(
                a.artistName,
                COUNT(a)
            )
            FROM Album a
            WHERE a.user = :user
            GROUP BY a.artistName
            ORDER BY COUNT(a) DESC
            """, ArtistAnalyticsResponse.class)
            .setParameter("user", user)
            .getResultList();
    }

    @Override
    public List<RatingAnalyticsResponse> getRatingStatistics(User user) {
        return entityManager.createQuery("""
            SELECT new com.musiccatalog.analytics.dto.RatingAnalyticsResponse(
                a.userRating,
                COUNT(a)
            )
            FROM Album a
            WHERE a.user = :user
              AND a.userRating IS NOT NULL
            GROUP BY a.userRating
            ORDER BY a.userRating
            """, RatingAnalyticsResponse.class)
            .setParameter("user", user)
            .getResultList();
    }

    @Override
    public List<ReleaseYearAnalyticsResponse> getReleaseYearStatistics(User user) {
        return entityManager.createQuery("""
            SELECT new com.musiccatalog.analytics.dto.ReleaseYearAnalyticsResponse(
                YEAR(a.releaseDate),
                COUNT(a)
            )
            FROM Album a
            WHERE a.user = :user
            GROUP BY YEAR(a.releaseDate)
            ORDER BY YEAR(a.releaseDate)
            """, ReleaseYearAnalyticsResponse.class)
            .setParameter("user", user)
            .getResultList();
    }
}
