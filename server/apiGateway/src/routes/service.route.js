import { Router } from "express";
import { userProxy } from "../proxies/userService.proxy.js";
import { productProxy } from "../proxies/productService.proxy.js";
import { paymentProxy } from "../proxies/paymentService.proxy.js";
import { orderProxy } from "../proxies/orderService.proxy.js";


const router = Router();

router.use("/api/v1/user", userProxy);
router.use("/api/v1/inventory", productProxy);
router.use("/api/v1/payment", paymentProxy);
router.use("/api/v1/checkout", orderProxy);

export default router;