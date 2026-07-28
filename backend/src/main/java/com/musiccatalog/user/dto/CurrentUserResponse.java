package com.musiccatalog.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CurrentUserResponse {

    private Long id;

    private String username;

    private String email;
}
