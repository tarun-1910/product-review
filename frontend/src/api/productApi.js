import api from "../api";

const API = "/products";

export const getAllProducts = () => api.get(API);

export const getMyProducts = () => api.get(`${API}/my`);


export const getProduct = (id) => api.get(`${API}/${id}`);

export const addProduct = (data) => api.post(API, data);

export const deleteProduct = (id) => api.delete(`${API}/${id}`);


export const searchProducts = (query) =>
  api.get(`/products/search?q=${query}`);




// 🔹 NEW – upload product image
export const uploadProductImage = (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`${API}/${productId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
