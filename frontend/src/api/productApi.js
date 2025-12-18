import api from "../api";

const API = "/products";

export const getAllProducts = () => api.get(API);

export const getProduct = (id) => api.get(`${API}/${id}`);
