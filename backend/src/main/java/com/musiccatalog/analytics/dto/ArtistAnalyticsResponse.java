package com.musiccatalog.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArtistAnalyticsResponse {

    private String artistName;
    private Long count;
}
