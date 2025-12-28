package com.reviewsystem.service.impl;

import com.reviewsystem.dto.ReviewDTO;
import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.entity.Review;
import com.reviewsystem.entity.User;
import com.reviewsystem.exception.DuplicateResourceException;
import com.reviewsystem.repository.ProductRepository;
import com.reviewsystem.repository.ReviewRepository;
import com.reviewsystem.repository.ReviewVoteRepository;
import com.reviewsystem.repository.UserRepository;
import com.reviewsystem.service.FileStorageService;
import com.reviewsystem.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewVoteRepository reviewVoteRepository;
    private final FileStorageService fileStorageService;

    @Override
    public Review addReview(Long productId, ReviewDTO dto, Long userId) {

        System.out.println("🔎 Checking duplicate review...");
        System.out.println("➡️ productId = " + productId + ", userId = " + userId);

        boolean exists = reviewRepository.existsByProductIdAndUserId(productId, userId);
        System.out.println("➡️ alreadyReviewed = " + exists);




        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new DuplicateResourceException(
                    "You have already reviewed this product"
            );
        }

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
    public Review addReviewWithImage(
            Long productId,
            ReviewDTO dto,
            Long userId,
            MultipartFile image
    ) {


        System.out.println("🧠 SERVICE: addReviewWithImage");
        System.out.println("➡️ productId = " + productId);
        System.out.println("➡️ userId = " + userId);

        Review review = addReview(productId, dto, userId); // reuse existing logic



        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = fileStorageService.storeReviewImage(image, review.getId());

                System.out.println("🟢 imagePath from storage = " + imagePath);

                review.setImageUrl(imagePath);

                System.out.println("🟢 review.imageUrl AFTER set = " + review.getImageUrl());

                Review saved =  reviewRepository.save(review);

                System.out.println("🟢 saved.imageUrl AFTER save = " + saved.getImageUrl());

                return(saved);
            } catch (Exception e) {
                throw new RuntimeException("Review image upload failed");
            }
        }

        return review;
    }








    @Override
    public List<ReviewResponseDTO> getReviewsByProduct(Long productId, Long userId) {

        List<Review> reviews = reviewRepository.findByProductId(productId);

        return reviews.stream().map(review -> {

            System.out.println(
                    "🟡 fetched review id=" + review.getId() +
                            " imageUrl=" + review.getImageUrl()
            );



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
                    .imageUrl(review.getImageUrl())
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

    @Override
    public List<ReviewResponseDTO> searchReviewsInProduct(Long productId, String query, Long userId) {

        List<Review> reviews = reviewRepository.searchByTextInProduct(productId, query);

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
                    .imageUrl(review.getImageUrl())
                    .build();
        }).toList();
    }


}
