package com.reviewsystem.service.impl;

import com.reviewsystem.dto.UserLoginDTO;
import com.reviewsystem.dto.UserRegistrationDTO;
import com.reviewsystem.entity.User;
import com.reviewsystem.exception.DuplicateResourceException;
import com.reviewsystem.exception.ResourceNotFoundException;
import com.reviewsystem.repository.UserRepository;
import com.reviewsystem.service.UserService;
import com.reviewsystem.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @Override
    public User register(UserRegistrationDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }



        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Override
    public String login(UserLoginDTO dto) {

          //used for debug
//        System.out.println("LOGIN EMAIL FROM REQUEST: " + dto.getEmail());
//        System.out.println("LOGIN PASSWORD FROM REQUEST: " + dto.getPassword());

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getFullName());
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
