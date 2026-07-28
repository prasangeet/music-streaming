package com.musiccatalog.security.currentuser;

import com.musiccatalog.user.entity.User;

public interface CurrentUserService {
    User getCurrentUser();
}
