package com.musiccatalog.itunes.service;

import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.itunes.dto.ItunesAlbumDto;

import java.util.List;

public interface ItunesService {

    List<ItunesAlbumDto> searchAlbums(String term);

    ItunesAlbumDto getAlbum(Long collectionId);

    AlbumResponse saveAlbum(Long collectionId);
}
