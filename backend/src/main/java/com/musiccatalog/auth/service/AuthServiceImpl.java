package com.musiccatalog.auth.service;

import com.musiccatalog.auth.dto.LoginRequest;
import com.musiccatalog.auth.dto.LoginResponse;
import com.musiccatalog.auth.dto.RegisterRequest;
import com.musiccatalog.auth.dto.RegisterResponse;
import com.musiccatalog.common.exception.auth.EmailAlreadyExistsException;
import com.musiccatalog.common.exception.auth.UsernameAlreadyExistsException;
import com.musiccatalog.security.jwt.JwtService;
import com.musiccatalog.user.entity.User;
import com.musiccatalog.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException(request.getUsername());
        }
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .build();
        User savedUser = userRepository.save(user);
        return RegisterResponse.builder()
            .id(savedUser.getId())
            .username(savedUser.getUsername())
            .email(savedUser.getEmail())
            .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "User not found with email: " + request.getEmail()
                )
            );

        String token = jwtService.generateToken(user);

        return LoginResponse.builder().token(token).build();
    }
}
