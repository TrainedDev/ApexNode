import { axiosInstance } from "../../lib/axios";

export const createCartService = async (productId) =>
  await axiosInstance.post(`/checkout/cart/${productId}`);

export const fetchCartService = async () =>
  await axiosInstance.get(`/checkout/cart`);

export const clearCartService = async (productId) =>
  await axiosInstance.delete(`/checkout/cart/${productId}`);

export const deleteProductFromCartService = async (productId) =>
  await axiosInstance.delete(`/checkout/cart/${productId}`);

export const updateCartService = async ({productId, quantity}) =>
  await axiosInstance.patch(`/checkout/cart/${productId}`, { quantity });
