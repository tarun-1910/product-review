package com.reviewsystem.controller;

import com.reviewsystem.dto.VoteRequestDTO;
import com.reviewsystem.entity.Review;
import com.reviewsystem.entity.User;
import com.reviewsystem.service.ReviewVoteService;
import com.reviewsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewVoteController {

    private final ReviewVoteService reviewVoteService;
    private final UserService userService;

    @PostMapping("/{reviewId}/vote")
    public Review voteReview(
            @PathVariable Long reviewId,
            @RequestBody VoteRequestDTO dto,
            Principal principal
    ) {

        System.out.println("PRINCIPAL = " + principal);

        User user = userService.getUserByEmail(principal.getName());

        return reviewVoteService.vote(
                reviewId,
                user.getId(),
                dto.getVoteType()
        );
    }
}
