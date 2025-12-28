package com.reviewsystem.repository;

import com.reviewsystem.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
    SELECT r FROM Review r
    JOIN r.user u
    WHERE r.product.id = :productId
    AND (
        LOWER(COALESCE(r.pros, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(COALESCE(r.cons, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(COALESCE(r.usedFor, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
        LOWER(COALESCE(u.fullName, '')) LIKE LOWER(CONCAT('%', :q, '%'))
    )
""")
    List<Review> searchByTextInProduct(
            @Param("productId") Long productId,
            @Param("q") String q
    );

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    List<Review> findByProductId(Long productId);
}
