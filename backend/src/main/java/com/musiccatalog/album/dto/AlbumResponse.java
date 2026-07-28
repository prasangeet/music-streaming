package com.musiccatalog.album.dto;

import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumResponse {

    private Long id;

    private Long appleCatalogId;

    private String title;

    private String artistName;

    private String genre;

    private LocalDate releaseDate;

    private Integer trackCount;

    private String artworkUrl;

    private Integer userRating;

    private String userNotes;

    private Boolean favourite;

    private Instant createdAt;

    private Instant updatedAt;
}
