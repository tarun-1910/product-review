package com.reviewsystem.service;

import com.reviewsystem.dto.UserLoginDTO;
import com.reviewsystem.dto.UserRegistrationDTO;
import com.reviewsystem.entity.User;

public interface UserService {

    User register(UserRegistrationDTO dto);

    String login(UserLoginDTO dto);

    User getUserById(Long id);

    User getUserByEmail(String email);
}
