package com.musiccatalog.auth.service;

import com.musiccatalog.auth.dto.LoginRequest;
import com.musiccatalog.auth.dto.LoginResponse;
import com.musiccatalog.auth.dto.RegisterRequest;
import com.musiccatalog.auth.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
