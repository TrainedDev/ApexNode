import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";
import { retrySleepService } from "../middleware/retrySleepService.middleware.js";

config();

export const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return req.originalUrl;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.session?.userId) {
        proxyReq.setHeader("x-user-id", req.session.userId);
      }
    },
    error: async (err, req, res) => {
      console.error("Payment proxy failed:", err.message);
      if (res.headersSent || res.destroyed) return;
      try {
        // 1. Wait for Payment Service to become healthy
        const healthy = await retrySleepService(Payment_SERVICE);
        if (!healthy) {
          return res
            .status(503)
            .json({ message: "Payment Service is temporarily unavailable." });
        }
        // 2. Only automatically retry GET requests
        if (req.method !== "GET") {
          return res
            .status(503)
            .json({ message: "Service is awake. Please retry your request." });
        }
        // 3. Retry the original GET request
        const response = await axios.get(
          `${PAYMENT_SERVICE}${req.originalUrl}`,
          {
            headers: {
              ...(req.session?.userId && { "x-user-id": req.session.userId }),
            },
            timeout: 15000,
          },
        );
        // // 4. Return the downstream response
        if (!res.headersSent && !res.destroyed) {
          return res.status(response.status).send(response.data);
        }
      } catch (retryError) {
        console.error("Payment retry failed:", retryError.message);
        if (!res.headersSent && !res.destroyed) {
          return res
            .status(503)
            .json({ message: "Payment Service is temporarily unavailable." });
        }
      }
    },
  },
});
