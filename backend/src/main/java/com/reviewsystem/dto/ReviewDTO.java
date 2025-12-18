package com.reviewsystem.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long productId;
    private String pros;
    private String cons;
    private String usedFor;
    private Integer rating;
}

