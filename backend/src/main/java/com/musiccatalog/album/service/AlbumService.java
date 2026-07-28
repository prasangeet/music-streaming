package com.musiccatalog.album.service;

import com.musiccatalog.album.dto.AlbumFilterRequest;
import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.album.dto.CreateAlbumRequest;
import com.musiccatalog.album.dto.UpdateAlbumRequest;
import com.musiccatalog.album.entity.Album;

import org.springframework.data.domain.Page;

public interface AlbumService {

    AlbumResponse createAlbum(CreateAlbumRequest request);

    Page<AlbumResponse> getAlbums(AlbumFilterRequest filter, int page, int size, String sortBy, String direction);

    AlbumResponse getAlbum(Long albumId);

    AlbumResponse updateAlbum(Long albumId, UpdateAlbumRequest request);

    void deleteAlbum(Long albumId);

    AlbumResponse saveAlbum(Album album);
}
