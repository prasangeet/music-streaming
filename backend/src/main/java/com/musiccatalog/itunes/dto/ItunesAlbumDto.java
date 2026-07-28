package com.musiccatalog.itunes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ItunesAlbumDto {

    @JsonProperty("collectionId")
    private Long collectionId;

    @JsonProperty("collectionName")
    private String collectionName;

    @JsonProperty("artistName")
    private String artistName;

    @JsonProperty("artworkUrl100")
    private String artworkUrl100;

    @JsonProperty("primaryGenreName")
    private String primaryGenreName;

    @JsonProperty("trackCount")
    private Integer trackCount;

    @JsonProperty("releaseDate")
    private OffsetDateTime releaseDate;
}
