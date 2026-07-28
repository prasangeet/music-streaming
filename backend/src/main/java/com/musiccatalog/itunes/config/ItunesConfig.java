package com.musiccatalog.itunes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class ItunesConfig {

    @Bean
    public RestClient itunesRestClient() {
        return RestClient.builder()
                .baseUrl("https://itunes.apple.com")
                .build();
    }
}
