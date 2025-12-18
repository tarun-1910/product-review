

package com.reviewsystem.service;

import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.dto.ReviewDTO;
import com.reviewsystem.entity.Review;

import java.util.List;

public interface ReviewService {
    Review addReview(ReviewDTO dto,Long userId);
    List<ReviewResponseDTO> getReviewsByProduct(Long productId, Long userId);
}

