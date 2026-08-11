import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  createBulkProducts,
  fetchCartProducts
} from "../controller/product.controller.js";
import { asyncHandler } from "../utils/handler.utils.js";

const router = Router();

router.post("/product", asyncHandler(createProduct));

router
  .route("/product/:id")
  .get(asyncHandler(getProduct))
  .patch(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

router.post("/products/cart", asyncHandler(fetchCartProducts));

router.route("/products").get(asyncHandler(getAllProducts)).post(asyncHandler(createBulkProducts));

export default router;
