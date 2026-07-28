package com.musiccatalog.common.exception.common;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Authentication required.");
    }
}
