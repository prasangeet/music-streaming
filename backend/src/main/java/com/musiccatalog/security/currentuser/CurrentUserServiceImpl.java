package com.musiccatalog.security.currentuser;

import com.musiccatalog.security.user.CustomUserDetails;
import com.musiccatalog.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    @Override
    public User getCurrentUser() {
        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
            (CustomUserDetails) authentication.getPrincipal();

        return userDetails.getUser();
    }
}
