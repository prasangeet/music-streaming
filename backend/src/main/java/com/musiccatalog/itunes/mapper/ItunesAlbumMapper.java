package com.musiccatalog.itunes.mapper;

import com.musiccatalog.album.entity.Album;
import com.musiccatalog.itunes.dto.ItunesAlbumDto;
import org.springframework.stereotype.Component;

@Component
public class ItunesAlbumMapper {

    public Album toEntity(ItunesAlbumDto dto) {

        Album album = new Album();

        album.setAppleCatalogId(dto.getCollectionId());
        album.setTitle(dto.getCollectionName());
        album.setArtistName(dto.getArtistName());
        album.setGenre(dto.getPrimaryGenreName());
        album.setArtworkUrl(dto.getArtworkUrl100());
        album.setTrackCount(dto.getTrackCount());

        if (dto.getReleaseDate() != null) {
            album.setReleaseDate(dto.getReleaseDate().toLocalDate());
        }

        album.setFavourite(false);
        album.setUserRating(null);
        album.setUserNotes(null);

        return album;
    }
}
