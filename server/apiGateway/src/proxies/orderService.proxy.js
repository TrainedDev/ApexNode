import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";
import { retrySleepService } from "../middleware/retrySleepService.middleware.js";

config();

export const orderProxy = createProxyMiddleware({
  target: process.env.ORDER_SERVICE,
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
      console.error("Order proxy failed:", err.message);
      if (res.headersSent || res.destroyed) return;
      try {
        // 1. Wait for Order Service to become healthy
        const healthy = await retrySleepService(Order_SERVICE);
        if (!healthy) {
          return res
            .status(503)
            .json({ message: "Order Service is temporarily unavailable." });
        }
        // 2. Only automatically retry GET requests
        if (req.method !== "GET") {
          return res
            .status(503)
            .json({ message: "Service is awake. Please retry your request." });
        }
        // 3. Retry the original GET request
        const response = await axios.get(
          `${ORDER_SERVICE}${req.originalUrl}`,
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
        console.error("Order retry failed:", retryError.message);
        if (!res.headersSent && !res.destroyed) {
          return res
            .status(503)
            .json({ message: "Order Service is temporarily unavailable." });
        }
      }
    },
  },
});
