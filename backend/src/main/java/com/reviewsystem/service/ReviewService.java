

package com.reviewsystem.service;

import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.dto.ReviewDTO;
import com.reviewsystem.entity.Review;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService {
    Review addReview(Long productId,ReviewDTO dto,Long userId);

    Review addReviewWithImage(
            Long productId,
            ReviewDTO dto,
            Long userId,
            MultipartFile image
    );


    List<ReviewResponseDTO> getReviewsByProduct(Long productId, Long userId);
    void deleteReview(Long reviewId, Long userId);
    List<ReviewResponseDTO> searchReviewsInProduct(Long productId, String query, Long userId);

}

