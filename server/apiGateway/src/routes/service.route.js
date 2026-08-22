import { Router } from "express";
import { userProxy } from "../proxies/userService.proxy.js";
import { productProxy } from "../proxies/productService.proxy.js";
import { paymentProxy } from "../proxies/paymentService.proxy.js";
import { orderProxy } from "../proxies/orderService.proxy.js";
import {
  statusLimiter,
  generalLimiter,
  orderLimiter,
  paymentLimiter,
  userLimiter,
} from "../middleware/rateLimit.middleware.js";
import { retrySleepService } from "../middleware/retrySleepService.middleware.js";
import { config } from "dotenv";

config();

const { USER_SERVICE, PRODUCT_SERVICE, ORDER_SERVICE, PAYMENT_SERVICE } =
  process.env;
const router = Router();

router.get(
  "/api/v1/user/status",
  retrySleepService(USER_SERVICE),
  statusLimiter,
  userProxy,
);
router.use(
  "/api/v1/user",
  retrySleepService(USER_SERVICE),
  userLimiter,
  userProxy,
);
router.use(
  "/api/v1/inventory",
  retrySleepService(PRODUCT_SERVICE),
  generalLimiter,
  productProxy,
);
router.use(
  "/api/v1/payment",
  retrySleepService(PAYMENT_SERVICE),
  paymentLimiter,
  paymentProxy,
);
router.use(
  "/api/v1/checkout",
  retrySleepService(ORDER_SERVICE),
  orderLimiter,
  orderProxy,
);

export default router;
