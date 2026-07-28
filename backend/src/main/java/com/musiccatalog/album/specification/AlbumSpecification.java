package com.musiccatalog.album.specification;

import com.musiccatalog.album.dto.AlbumFilterRequest;
import com.musiccatalog.album.entity.Album;
import com.musiccatalog.user.entity.User;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class AlbumSpecification {

    public static Specification<Album> withFilters(
            User user,
            AlbumFilterRequest filter
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    cb.equal(root.get("user"), user)
            );

            if (filter.getTitle() != null && !filter.getTitle().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("title")),
                                "%" + filter.getTitle().toLowerCase() + "%"
                        )
                );
            }

            if (filter.getArtist() != null && !filter.getArtist().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("artistName")),
                                "%" + filter.getArtist().toLowerCase() + "%"
                        )
                );
            }

            if (filter.getGenre() != null && !filter.getGenre().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("genre")),
                                "%" + filter.getGenre().toLowerCase() + "%"
                        )
                );
            }

            if (filter.getFavourite() != null) {
                predicates.add(
                        cb.equal(
                                root.get("favourite"),
                                filter.getFavourite()
                        )
                );
            }

            if (filter.getRating() != null) {
                predicates.add(
                        cb.equal(
                                root.get("userRating"),
                                filter.getRating()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
