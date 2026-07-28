package com.musiccatalog.album.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumFilterRequest {

    private String title;

    private String artist;

    private String genre;

    private Boolean favourite;

    private Integer rating;
}
