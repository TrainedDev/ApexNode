import { axiosInstance } from "../../lib/axios";

export const createOrderService = async (data) => await axiosInstance.post("/checkout/orders", data);
export const fetchOrderService = async () => await axiosInstance.get("/checkout/orders");