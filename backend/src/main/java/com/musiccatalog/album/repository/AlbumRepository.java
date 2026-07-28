package com.musiccatalog.album.repository;

import com.musiccatalog.album.entity.Album;

import com.musiccatalog.user.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AlbumRepository extends
        JpaRepository<Album, Long>,
        JpaSpecificationExecutor<Album> {

    Page<Album> findAllByUser(User user, Pageable pageable);

    Optional<Album> findByIdAndUser(Long id, User user);

    boolean existsByAppleCatalogIdAndUser(
            Long appleCatalogId,
            User user
    );

    void deleteByIdAndUser(Long id, User user);
}
