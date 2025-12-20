package com.reviewsystem.service.impl;

import com.reviewsystem.dto.ReviewDTO;
import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.entity.Review;
import com.reviewsystem.entity.User;
import com.reviewsystem.repository.ProductRepository;
import com.reviewsystem.repository.ReviewRepository;
import com.reviewsystem.repository.ReviewVoteRepository;
import com.reviewsystem.repository.UserRepository;
import com.reviewsystem.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewVoteRepository reviewVoteRepository;

    @Override
    public Review addReview(Long productId,ReviewDTO dto, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .pros(dto.getPros())
                .cons(dto.getCons())
                .usedFor(dto.getUsedFor())
                .rating(dto.getRating())
                .helpfulCount(0)
                .notHelpfulCount(0)
                .build();

        return reviewRepository.save(review);
    }


    @Override
    public List<ReviewResponseDTO> getReviewsByProduct(Long productId, Long userId) {

        List<Review> reviews = reviewRepository.findByProductId(productId);

        return reviews.stream().map(review -> {

            String userVote = null;

            if (userId != null) {
                userVote = reviewVoteRepository
                        .findByReviewIdAndUserId(review.getId(), userId)
                        .map(v -> v.getVoteType().name())
                        .orElse(null);
            }


            return ReviewResponseDTO.builder()
                    .id(review.getId())
                    .pros(review.getPros())
                    .cons(review.getCons())
                    .usedFor(review.getUsedFor())
                    .rating(review.getRating())
                    .helpfulCount(review.getHelpfulCount())
                    .notHelpfulCount(review.getNotHelpfulCount())
                    .authorId(review.getUser().getId())
                    .authorName(review.getUser().getFullName())
                    .userVote(userVote)
                    .build();
        }).toList();
    }


    @Override
    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));


        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this review");
        }



         reviewRepository.delete(review);
    }
}
