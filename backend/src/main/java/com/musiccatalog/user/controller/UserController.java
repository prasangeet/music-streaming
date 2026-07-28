package com.musiccatalog.user.controller;

import com.musiccatalog.user.dto.CurrentUserResponse;
import com.musiccatalog.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser() {
        CurrentUserResponse response = userService.getCurrentUser();
        return ResponseEntity.ok(response);
    }
}
