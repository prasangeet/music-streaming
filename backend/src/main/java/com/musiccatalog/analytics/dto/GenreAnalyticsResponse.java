package com.musiccatalog.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GenreAnalyticsResponse {

    private String genre;
    private Long count;
}
