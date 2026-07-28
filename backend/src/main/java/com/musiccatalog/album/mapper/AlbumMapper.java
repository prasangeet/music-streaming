package com.musiccatalog.album.mapper;

import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.album.entity.Album;
import org.springframework.stereotype.Component;

@Component
public class AlbumMapper {

    public AlbumResponse toResponse(Album album) {

        AlbumResponse response = new AlbumResponse();

        response.setId(album.getId());
        response.setAppleCatalogId(album.getAppleCatalogId());
        response.setTitle(album.getTitle());
        response.setArtistName(album.getArtistName());
        response.setGenre(album.getGenre());
        response.setReleaseDate(album.getReleaseDate());
        response.setTrackCount(album.getTrackCount());
        response.setArtworkUrl(album.getArtworkUrl());
        response.setUserRating(album.getUserRating());
        response.setUserNotes(album.getUserNotes());
        response.setFavourite(album.getFavourite());
        response.setCreatedAt(album.getCreatedAt());
        response.setUpdatedAt(album.getUpdatedAt());

        return response;
    }
}
