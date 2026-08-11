import { axiosInstance } from "../../lib/axios";

export const verifyPaymentService = async (data) => axiosInstance.post("/payment/verify", data);
export const razorpayWebHookService = async (data) => axiosInstance.post("/payment/razorpay-webhook", data);