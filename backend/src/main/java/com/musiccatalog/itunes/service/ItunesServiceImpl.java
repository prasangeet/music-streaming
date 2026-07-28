package com.musiccatalog.itunes.service;

import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.album.entity.Album;
import com.musiccatalog.album.service.AlbumService;
import com.musiccatalog.common.exception.album.AlbumNotFoundException;
import com.musiccatalog.itunes.client.ItunesClient;
import com.musiccatalog.itunes.dto.ItunesAlbumDto;
import com.musiccatalog.itunes.dto.ItunesSearchResponse;
import com.musiccatalog.itunes.mapper.ItunesAlbumMapper;

import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItunesServiceImpl implements ItunesService {

    private final ItunesClient itunesClient;
    private final AlbumService albumService;
    private final ItunesAlbumMapper itunesAlbumMapper;

    @Override
    public List<ItunesAlbumDto> searchAlbums(String term) {

        ItunesSearchResponse response =
                itunesClient.searchAlbums(term);

        if (response == null || response.getResults() == null) {
            return Collections.emptyList();
        }

        return response.getResults();
    }

    @Override
    public ItunesAlbumDto getAlbum(Long collectionId) {
        return itunesClient.getAlbum(collectionId);
    }

    @Override
    public AlbumResponse saveAlbum(Long collectionId) {

        ItunesAlbumDto dto = itunesClient.getAlbum(collectionId);

        if (dto == null) {
            throw new AlbumNotFoundException(collectionId);
        }

        Album album = itunesAlbumMapper.toEntity(dto);

        return albumService.saveAlbum(album);
    }
}
