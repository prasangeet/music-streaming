package com.musiccatalog.user.service;

import com.musiccatalog.security.currentuser.CurrentUserService;
import com.musiccatalog.user.dto.CurrentUserResponse;
import com.musiccatalog.user.entity.User;
import com.musiccatalog.user.mapper.UserMapper;
import com.musiccatalog.user.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CurrentUserService currentUserService;

    @Override
    public User create(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public CurrentUserResponse getCurrentUser() {
        User user = currentUserService.getCurrentUser();
        
        return userMapper.toCurrentUserResponse(user);
    }
}
