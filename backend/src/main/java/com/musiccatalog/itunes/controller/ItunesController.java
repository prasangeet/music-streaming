package com.musiccatalog.itunes.controller;

import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.itunes.dto.ItunesAlbumDto;
import com.musiccatalog.itunes.service.ItunesService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itunes")
@RequiredArgsConstructor
public class ItunesController {

    private final ItunesService itunesService;

    @GetMapping("/search")
    public ResponseEntity<List<ItunesAlbumDto>> searchAlbums(
            @RequestParam String term
    ) {

        return ResponseEntity.ok(
                itunesService.searchAlbums(term)
        );
    }

    @GetMapping("/albums/{collectionId}")
    public ResponseEntity<ItunesAlbumDto> getAlbum(
            @PathVariable Long collectionId
    ) {
        return ResponseEntity.ok(
                itunesService.getAlbum(collectionId)
        );
    }


    @PostMapping("/albums/{collectionId}/save")
    public ResponseEntity<AlbumResponse> saveAlbum(
            @PathVariable Long collectionId
    ) {
        return ResponseEntity.ok(
                itunesService.saveAlbum(collectionId)
        );
    }
}
