import { Router } from "express";
import { userProxy } from "../proxies/userService.proxy.js";
import {
  productProxy,
} from "../proxies/productService.proxy.js";
import {
  paymentProxy,
} from "../proxies/paymentService.proxy.js";
import { orderProxy } from "../proxies/orderService.proxy.js";
import {
  statusLimiter,
  generalLimiter,
  orderLimiter,
  paymentLimiter,
  userLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/api/v1/user/status", statusLimiter, userProxy);
router.use("/api/v1/user", userLimiter, userProxy);
router.use(
  "/api/v1/inventory",
  generalLimiter,
  productProxy,
);
router.use("/api/v1/payment", paymentLimiter, paymentProxy);
router.use("/api/v1/checkout",  orderLimiter, orderProxy);

export default router;
