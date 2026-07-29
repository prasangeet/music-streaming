package com.musiccatalog.ai.controller;

import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.ai.dto.LibraryInsightsResponse;
import com.musiccatalog.ai.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/library/insights")
    public ResponseEntity<LibraryInsightsResponse> generateLibraryInsights() {
        return ResponseEntity.ok(
                aiService.generateLibraryInsights()
        );
    }

    @GetMapping("/albums/{albumId}/insights")
    public ResponseEntity<AlbumInsightsResponse> getAlbumInsights(
            @PathVariable Long albumId
    ) {
        return ResponseEntity.ok(
                aiService.generateAlbumInsights(albumId)
        );
    }

    @PostMapping("/albums/{albumId}/insights/refresh")
    public ResponseEntity<AlbumInsightsResponse> refreshAlbumInsights(
            @PathVariable Long albumId
    ) {
        return ResponseEntity.ok(
                aiService.refreshAlbumInsights(albumId)
        );
    }
}
