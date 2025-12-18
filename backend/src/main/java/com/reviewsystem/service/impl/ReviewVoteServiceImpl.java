package com.reviewsystem.service.impl;

import com.reviewsystem.entity.*;
import com.reviewsystem.repository.*;
import com.reviewsystem.service.ReviewVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewVoteServiceImpl implements ReviewVoteService {

    private final ReviewRepository reviewRepository;
    private final ReviewVoteRepository voteRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Review vote(Long reviewId, Long userId, VoteType newVote) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        System.out.println("Logged-in userId = " + userId);
        System.out.println("Review authorId = " + review.getUser().getId());



        // ❌ Prevent self-voting

        if (review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own review");
        }


        Optional<ReviewVote> existingVoteOpt =
                voteRepository.findByReviewIdAndUserId(reviewId, userId);

        if (existingVoteOpt.isPresent()) {
            ReviewVote existingVote = existingVoteOpt.get();

            // If same vote → do nothing
            if (existingVote.getVoteType() == newVote) {
                return review;
            }

            // Remove old count
            if (existingVote.getVoteType() == VoteType.HELPFUL) {
                review.setHelpfulCount(review.getHelpfulCount() - 1);
            } else {
                review.setNotHelpfulCount(review.getNotHelpfulCount() - 1);
            }

            existingVote.setVoteType(newVote);
            voteRepository.save(existingVote);

        } else {
            ReviewVote vote = ReviewVote.builder()
                    .review(review)
                    .user(user)
                    .voteType(newVote)
                    .build();
            voteRepository.save(vote);
        }

        // Add new count
        if (newVote == VoteType.HELPFUL) {
            review.setHelpfulCount(review.getHelpfulCount() + 1);
        } else {
            review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
        }

        return reviewRepository.save(review);
    }
}
