package com.reviewsystem.service;

import com.reviewsystem.entity.Review;
import com.reviewsystem.entity.VoteType;

public interface ReviewVoteService {

    Review vote(Long reviewId, Long userId, VoteType voteType);
}
