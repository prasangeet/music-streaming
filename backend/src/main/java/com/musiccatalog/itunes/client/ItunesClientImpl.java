package com.musiccatalog.itunes.client;

import com.musiccatalog.itunes.dto.ItunesAlbumDto;
import com.musiccatalog.itunes.dto.ItunesSearchResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class ItunesClientImpl implements ItunesClient {

    private final RestClient itunesRestClient;
    private final ObjectMapper objectMapper;

    @Override
    public ItunesSearchResponse searchAlbums(String term) {

        String json = itunesRestClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("term", term)
                        .queryParam("entity", "album")
                        .build())
                .retrieve()
                .body(String.class);

        try {
            return objectMapper.readValue(json, ItunesSearchResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ItunesAlbumDto getAlbum(Long collectionId) {

        String json = itunesRestClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/lookup")
                        .queryParam("id", collectionId)
                        .queryParam("entity", "album")
                        .build())
                .retrieve()
                .body(String.class);

        try {
            ItunesSearchResponse response =
                    objectMapper.readValue(json, ItunesSearchResponse.class);

            if (response == null
                    || response.getResults() == null
                    || response.getResults().isEmpty()) {
                return null;
            }

            return response.getResults().get(0);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
