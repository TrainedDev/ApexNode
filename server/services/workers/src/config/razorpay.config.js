import Razorpay from "razorpay";
import { config } from "dotenv";

config();

const { RAZORPAY_TEST_KEY, RAZORPAY_TEST_SECRET_KEY } = process.env;

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_TEST_KEY,
  key_secret: RAZORPAY_TEST_SECRET_KEY,
});
