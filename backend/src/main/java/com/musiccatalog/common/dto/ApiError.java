package com.musiccatalog.common.dto;

import java.time.Instant;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiError {

    private Instant timestamp;

    private int status;

    private String error;

    private String message;

    private String path;

    private Map<String, String> errors;
}
