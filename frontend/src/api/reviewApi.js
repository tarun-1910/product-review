import api from "../api";

export const addReview = (data) => api.post("/reviews", data);




export const getReviewsByProduct = (productId) =>
  api.get(`/products/${productId}/reviews`);




export const voteReview = (reviewId, voteType) =>
  api.post(`/api/reviews/${reviewId}/vote`, { voteType });
