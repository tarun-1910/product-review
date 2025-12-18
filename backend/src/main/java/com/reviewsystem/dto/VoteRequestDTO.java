package com.reviewsystem.dto;

import com.reviewsystem.entity.VoteType;
import lombok.Data;

@Data
public class VoteRequestDTO {
    private VoteType voteType;
}
