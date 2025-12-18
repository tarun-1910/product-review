package com.reviewsystem.controller;

import com.reviewsystem.dto.UserLoginDTO;
import com.reviewsystem.dto.UserRegistrationDTO;
import com.reviewsystem.dto.ApiResponse;
import com.reviewsystem.service.UserService;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse register(@RequestBody UserRegistrationDTO dto) {
        userService.register(dto);
        return new ApiResponse("Registered successfully", true);
    }

    @PostMapping("/login")
    public ApiResponse login(@RequestBody UserLoginDTO dto) {
       String token  = userService.login(dto);
        return new ApiResponse(token, true);
    }
}
