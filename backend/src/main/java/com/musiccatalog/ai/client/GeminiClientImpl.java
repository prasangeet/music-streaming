package com.musiccatalog.ai.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.musiccatalog.ai.dto.AlbumInsightsResponse;
import com.musiccatalog.ai.dto.LibraryInsightsResponse;
import com.musiccatalog.ai.prompt.PromptBuilder;
import com.musiccatalog.common.exception.ai.AIException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClientImpl implements GeminiClient {

    @Value("${google.ai.model}")
    private String model;

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    @Override
    public AlbumInsightsResponse generateAlbumInsights(
            String title,
            String artist,
            String genre
    ) {

        String prompt = PromptBuilder.albumInsightsPrompt(
                title,
                artist,
                genre
        );

        return generateJsonResponse(prompt, AlbumInsightsResponse.class);
    }

    @Override
    public LibraryInsightsResponse generateLibraryInsights(String librarySnapshot) {

        String prompt = PromptBuilder.libraryInsightsPrompt(librarySnapshot);

        return generateJsonResponse(prompt, LibraryInsightsResponse.class);
    }

    private <T> T generateJsonResponse(String prompt, Class<T> responseType) {

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("application/json")
                .build();

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        model,
                        prompt,
                        config
                );

        String json = response.text();

        if (json == null || json.isBlank()) {
            throw new AIException("Gemini returned an empty response.");
        }

        log.debug("Gemini JSON response:\n{}", json);

        try {
            return objectMapper.readValue(json, responseType);
        } catch (Exception ex) {
            log.error("Failed to parse Gemini response:\n{}", json, ex);
            throw new AIException(
                    "Failed to deserialize Gemini response.",
                    ex
            );
        }
    }
}
