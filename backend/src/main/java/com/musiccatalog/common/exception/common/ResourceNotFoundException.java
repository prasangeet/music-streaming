package com.musiccatalog.common.exception.common;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource) {
        super(resource + " not found.");
    }
}
