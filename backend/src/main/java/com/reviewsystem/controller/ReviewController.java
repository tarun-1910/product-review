package com.reviewsystem.controller;

import com.reviewsystem.dto.ReviewDTO;
import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.entity.Review;
import com.reviewsystem.entity.User;
import com.reviewsystem.service.ReviewService;
import com.reviewsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping("/product/{productId}")
    public Review addReview(
            @PathVariable Long productId,
            @RequestBody ReviewDTO dto,
            Principal principal
    ) {
        if (principal == null) {
            throw new RuntimeException("Login required");
        }

        User user = userService.getUserByEmail(principal.getName());
        return reviewService.addReview(productId,dto, user.getId());
    }


    @GetMapping("/product/{productId}")
    public List<ReviewResponseDTO> getReviewsByProduct(
            @PathVariable Long productId,
            Principal principal
    ) {

        Long userId = null;

        if (principal != null) {
            User user = userService.getUserByEmail(principal.getName());
            userId = user.getId();
        }
            return reviewService.getReviewsByProduct(productId, userId);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Login required");
        }

        // ALWAYS resolve user from DB
        User user = userService.getUserByEmail(principal.getName());

        reviewService.deleteReview(reviewId, user.getId());
        return ResponseEntity.ok().build();
    }


}
