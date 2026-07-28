package com.musiccatalog.album.service;

import com.musiccatalog.album.dto.AlbumFilterRequest;
import com.musiccatalog.album.dto.AlbumResponse;
import com.musiccatalog.album.dto.CreateAlbumRequest;
import com.musiccatalog.album.dto.UpdateAlbumRequest;
import com.musiccatalog.album.entity.Album;
import com.musiccatalog.album.mapper.AlbumMapper;
import com.musiccatalog.album.repository.AlbumRepository;
import com.musiccatalog.album.specification.AlbumSpecification;
import com.musiccatalog.common.exception.album.AlbumAlreadyExistsException;
import com.musiccatalog.common.exception.album.AlbumNotFoundException;
import com.musiccatalog.security.currentuser.CurrentUserService;
import com.musiccatalog.user.entity.User;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;
    private final CurrentUserService currentUserService;

    @Override
    public AlbumResponse createAlbum(CreateAlbumRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        if (albumRepository.existsByAppleCatalogIdAndUser(
                request.getAppleCatalogId(),
                currentUser
        )) {
            throw new AlbumAlreadyExistsException(request.getTitle());
        }

        Album album = Album.builder()
                .appleCatalogId(request.getAppleCatalogId())
                .title(request.getTitle())
                .artistName(request.getArtistName())
                .genre(request.getGenre())
                .trackCount(request.getTrackCount())
                .artworkUrl(request.getArtworkUrl())
                .userRating(request.getUserRating())
                .userNotes(request.getUserNotes())
                .favourite(Boolean.TRUE.equals(request.getFavourite()))
                .user(currentUser)
                .build();

        Album savedAlbum = albumRepository.save(album);

        return albumMapper.toResponse(savedAlbum);
    }

    @Override
    public Page<AlbumResponse> getAlbums(
            AlbumFilterRequest filter,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        User currentUser = currentUserService.getCurrentUser();

        Specification<Album> specification =
                AlbumSpecification.withFilters(currentUser, filter);

        Page<Album> albums =
                albumRepository.findAll(specification, pageable);

        return albums.map(albumMapper::toResponse);
    }

    @Override
    public AlbumResponse getAlbum(Long albumId) {

        User currentUser = currentUserService.getCurrentUser();

        Album album = albumRepository
                .findByIdAndUser(albumId, currentUser)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        return albumMapper.toResponse(album);
    }

    @Override
    public AlbumResponse updateAlbum(Long albumId, UpdateAlbumRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Album album = albumRepository
                .findByIdAndUser(albumId, currentUser)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        if (request.getUserRating() != null) {
            album.setUserRating(request.getUserRating());
        }

        if (request.getUserNotes() != null) {
            album.setUserNotes(request.getUserNotes());
        }

        if (request.getFavourite() != null) {
            album.setFavourite(request.getFavourite());
        }

        Album updatedAlbum = albumRepository.save(album);

        return albumMapper.toResponse(updatedAlbum);
    }

    @Override
    public void deleteAlbum(Long albumId) {

        User currentUser = currentUserService.getCurrentUser();

        Album album = albumRepository
                .findByIdAndUser(albumId, currentUser)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        albumRepository.delete(album);
    }

    @Override
    public AlbumResponse saveAlbum(Album album) {

        User currentUser = currentUserService.getCurrentUser();

        if (albumRepository.existsByAppleCatalogIdAndUser(
                album.getAppleCatalogId(),
                currentUser
        )) {
            throw new AlbumAlreadyExistsException("Album already exists.");
        }

        album.setUser(currentUser);

        Album savedAlbum = albumRepository.save(album);

        return albumMapper.toResponse(savedAlbum);
    }
}
