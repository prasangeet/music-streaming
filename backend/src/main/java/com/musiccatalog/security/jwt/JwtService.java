package com.musiccatalog.security.jwt;

import com.musiccatalog.user.entity.User;

public interface JwtService {
    String generateToken(User user);

    String extractEmail(String token);

    boolean isTokenValid(String token, User user);
}
