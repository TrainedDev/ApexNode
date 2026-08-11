import express from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  razorpayWebHook,
  verifyPayment,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/verify", express.json(), asyncHandler(verifyPayment));
router.post(
  "/razorpay-webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(razorpayWebHook),
);

export default router;
