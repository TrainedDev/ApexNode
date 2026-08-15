import { Router } from "express";
import { userProxy, userServiceWake } from "../proxies/userService.proxy.js";
import {
  productProxy,
  productServiceWake,
} from "../proxies/productService.proxy.js";
import {
  paymentProxy,
  paymentServiceWake,
} from "../proxies/paymentService.proxy.js";
import { orderProxy, orderServiceWake } from "../proxies/orderService.proxy.js";
import {
  statusLimiter,
  generalLimiter,
  orderLimiter,
  paymentLimiter,
  userLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/api/v1/user/status", userServiceWake, statusLimiter, userProxy);
router.use("/api/v1/user", userServiceWake, userLimiter, userProxy);
router.use(
  "/api/v1/inventory",
  productServiceWake,
  generalLimiter,
  productProxy,
);
router.use("/api/v1/payment", paymentServiceWake, paymentLimiter, paymentProxy);
router.use("/api/v1/checkout", orderServiceWake, orderLimiter, orderProxy);

export default router;
