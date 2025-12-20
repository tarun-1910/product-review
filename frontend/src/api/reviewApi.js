import api from "../api";

export const addReview = (productId, data) =>
 api.post(`/reviews/product/${productId}`, data);



export const getReviewsByProduct = (productId) =>
 api.get(`/reviews/product/${productId}`);



export const deleteReview = (reviewId) =>
  api.delete(`/reviews/${reviewId}`);



export const voteReview = (reviewId, voteType) =>
  api.post(`/api/reviews/${reviewId}/vote`, { voteType });
