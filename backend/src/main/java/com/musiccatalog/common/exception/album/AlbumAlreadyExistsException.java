package com.musiccatalog.common.exception.album;

public class AlbumAlreadyExistsException extends RuntimeException {

    public AlbumAlreadyExistsException(String title) {
        super("Album already exists in your collection: " + title);
    }
}
