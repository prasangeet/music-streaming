package com.musiccatalog.common.exception.common;

public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("Access denied.");
    }
}
