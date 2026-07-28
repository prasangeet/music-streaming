package com.musiccatalog.itunes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ItunesSearchResponse {

    @JsonProperty("resultCount")
    private Integer resultCount;

    @JsonProperty("results")
    private List<ItunesAlbumDto> results;
}
