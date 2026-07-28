package com.musiccatalog.itunes.client;

import com.musiccatalog.itunes.dto.ItunesAlbumDto;
import com.musiccatalog.itunes.dto.ItunesSearchResponse;

public interface ItunesClient {

    ItunesSearchResponse searchAlbums(String term);

    ItunesAlbumDto getAlbum(Long collectionId);
}
