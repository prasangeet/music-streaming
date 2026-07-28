package com.musiccatalog.common.exception.auth;

public class TokenExpiredException extends RuntimeException {

    public TokenExpiredException() {
        super("JWT token has expired.");
    }
}
