import Razorpay from "razorpay";
import { config } from "dotenv";

config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY,
  key_secret: process.env.RAZORPAY_TEST_SECRET_KEY,
});
