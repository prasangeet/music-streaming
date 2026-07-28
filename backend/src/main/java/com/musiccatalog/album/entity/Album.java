package com.musiccatalog.album.entity;

import com.musiccatalog.common.entity.BaseEntity;
import com.musiccatalog.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(
    name = "albums",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "apple_catalog_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Album extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apple_catalog_id", nullable = false)
    private Long appleCatalogId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artistName;

    private String genre;

    private LocalDate releaseDate;

    private Integer trackCount;

    @Column(columnDefinition = "TEXT")
    private String artworkUrl;

    private Integer userRating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String userNotes;

    @Builder.Default
    private Boolean favourite = false;

    // =========================
    // AI Insights
    // =========================

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String aiMoods;

    @Column(columnDefinition = "TEXT")
    private String aiThemes;

    @Column(columnDefinition = "TEXT")
    private String aiRecommendedFor;

    @Column(columnDefinition = "TEXT")
    private String aiSimilarArtists;

    private Instant aiGeneratedAt;
}
