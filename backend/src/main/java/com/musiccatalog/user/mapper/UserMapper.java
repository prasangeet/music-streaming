package com.musiccatalog.user.mapper;

import com.musiccatalog.user.dto.CurrentUserResponse;
import com.musiccatalog.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public CurrentUserResponse toCurrentUserResponse(User user) {
        CurrentUserResponse response = new CurrentUserResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());

        return response;
    }
}
