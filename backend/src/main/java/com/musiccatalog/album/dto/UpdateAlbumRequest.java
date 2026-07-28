package com.musiccatalog.album.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAlbumRequest {

    @Min(1)
    @Max(5)
    private Integer userRating;

    private String userNotes;

    private Boolean favourite;
}
