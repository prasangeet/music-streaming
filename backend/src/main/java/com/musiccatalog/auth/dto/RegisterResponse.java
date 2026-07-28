package com.musiccatalog.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterResponse {

    private Long id;

    private String username;

    private String email;
}
