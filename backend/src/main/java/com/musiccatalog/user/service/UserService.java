package com.musiccatalog.user.service;

import com.musiccatalog.user.dto.CurrentUserResponse;
import com.musiccatalog.user.entity.User;
import java.util.Optional;

public interface UserService {
    User create(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    CurrentUserResponse getCurrentUser();
}
