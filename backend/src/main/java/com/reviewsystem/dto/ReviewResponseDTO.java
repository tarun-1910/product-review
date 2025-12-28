package com.reviewsystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponseDTO {

    private Long id;
    private String pros;
    private String cons;
    private String usedFor;
    private Integer rating;

    private Integer helpfulCount;
    private Integer notHelpfulCount;

    private Long authorId;
    private String authorName;

    private String userVote; // HELPFUL | NOT_HELPFUL | null
    private String imageUrl;
}
