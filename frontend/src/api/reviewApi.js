import api from "../api";

export const addReview = (productId, data) =>
  api.post(`/reviews/product/${productId}`, data);


export const addReviewWithImage = (productId, data, image) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (image) {
    formData.append("image", image);
  }

    console.log("📦 Sending multipart request:");
    console.log("➡️ URL:", `/reviews/product/${productId}/with-image`);
    console.log("➡️ JSON:", data);
    console.log("➡️ Image:", image?.name);




  return api.post(
    `/reviews/product/${productId}/with-image`,
     formData
  );
};







export const getReviewsByProduct = (productId) =>
 api.get(`/reviews/product/${productId}`);



export const deleteReview = (reviewId) =>
  api.delete(`/reviews/${reviewId}`);



export const voteReview = (reviewId, voteType) =>
  api.post(`/api/reviews/${reviewId}/vote`, { voteType });


 export const searchReviewsInProduct = (productId, query) =>
   api.get(`/reviews/product/${productId}/search?q=${query}`);




