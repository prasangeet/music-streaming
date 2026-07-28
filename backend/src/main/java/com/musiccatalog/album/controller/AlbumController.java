package com.musiccatalog.album.controller;

import com.musiccatalog.album.dto.AlbumFilterRequest;
import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.album.dto.CreateAlbumRequest;
import com.musiccatalog.album.dto.UpdateAlbumRequest;
import com.musiccatalog.album.service.AlbumService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping
    public ResponseEntity<AlbumResponse> createAlbum(
            @Valid @RequestBody CreateAlbumRequest request
    ) {

        AlbumResponse response = albumService.createAlbum(request);

        return ResponseEntity
                .created(URI.create("/api/albums/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<Page<AlbumResponse>> getAlbums(

            @ModelAttribute AlbumFilterRequest filter,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction
    ) {

        return ResponseEntity.ok(
                albumService.getAlbums(
                        filter,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    @GetMapping("/{albumId}")
    public ResponseEntity<AlbumResponse> getAlbum(
            @PathVariable Long albumId
    ) {

        return ResponseEntity.ok(albumService.getAlbum(albumId));
    }

    @PutMapping("/{albumId}")
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable Long albumId,
            @Valid @RequestBody UpdateAlbumRequest request
    ) {

        return ResponseEntity.ok(
                albumService.updateAlbum(albumId, request)
        );
    }

    @DeleteMapping("/{albumId}")
    public ResponseEntity<Void> deleteAlbum(
            @PathVariable Long albumId
    ) {

        albumService.deleteAlbum(albumId);

        return ResponseEntity.noContent().build();
    }
}
