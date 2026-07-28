package com.musiccatalog.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";
}
