package com.musiccatalog.album.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAlbumRequest {

    @NotNull
    private Long appleCatalogId;

    @NotBlank
    private String title;

    @NotBlank
    private String artistName;

    private String genre;

    private String artworkUrl;

    private Integer trackCount;

    private Integer userRating;

    private String userNotes;

    private Boolean favourite;
}
