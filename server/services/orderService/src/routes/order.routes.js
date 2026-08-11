import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import { createOrder, fetchOrders } from "../controller/order.controller.js";

const router = Router();

router
  .route("/orders")
  .post(asyncHandler(createOrder))
  .get(asyncHandler(fetchOrders));

export default router;
