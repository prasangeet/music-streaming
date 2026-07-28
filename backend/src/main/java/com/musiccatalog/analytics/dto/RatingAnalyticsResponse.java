package com.musiccatalog.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RatingAnalyticsResponse {

    private Integer rating;
    private Long count;
}
