package com.musiccatalog.ai.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LibraryInsightsResponse {

    private String summary;

    private List<String> dominantGenres;

    private List<String> listeningPersonality;

    private List<String> trendHighlights;

    private List<String> recommendations;

    private List<String> discoverySuggestions;
}
