import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  clearCart,
  createCart,
  fetchCart,
  removeProductFromCart,
  updateCart,
} from "../controller/cart.controller.js";

const router = Router();

router
  .route("/cart/:productId")
  .post(asyncHandler(createCart))
  .patch(asyncHandler(updateCart))
  .delete(asyncHandler(removeProductFromCart));

router
  .route("/cart")
  .get(asyncHandler(fetchCart))
  .delete(asyncHandler(clearCart));

export default router;
