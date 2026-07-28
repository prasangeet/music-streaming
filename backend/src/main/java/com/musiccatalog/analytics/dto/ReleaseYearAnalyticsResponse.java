package com.musiccatalog.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReleaseYearAnalyticsResponse {

    private Integer year;
    private Long count;
}
