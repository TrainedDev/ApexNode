import { axiosInstance } from "../../lib/axios";

export const addProductService = async (data) =>
  axiosInstance.post("/inventory/product", data);

export const fetchProductService = async (id) =>
  axiosInstance.get(`/inventory/product/${id}`);

export const fetchAllProductService = async (data) =>
  axiosInstance.get("/inventory/products", data);

export const updateProductService = async (data) =>
  axiosInstance.post("/inventory/product", data);

export const deleteProductService = async (id) =>
  axiosInstance.delete(`/inventory/product/${id}`);

export const cartProductService = async (data) =>
  axiosInstance.post(`/inventory/products/cart`, data);
