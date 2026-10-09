import { createProxyMiddleware } from "http-proxy-middleware";
import axios from "axios";
import { config } from "dotenv";
import { retrySleepService } from "../middleware/retrySleepService.middleware.js";
config();

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE;
const WORKER_URL = process.env.WORKER_URL;

export const productProxy = createProxyMiddleware({
  target: PRODUCT_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => req.originalUrl,

  on: {
    proxyReq: (proxyReq, req) => {
      if (req.session?.userId) {
        proxyReq.setHeader("x-user-id", req.session.userId);
      }
    },

    error: async (err, req, res) => {
      console.error("Product proxy failed:", err.message);
      if (res.headersSent || res.destroyed) return;
      try {
        // 1. Wait for Product Service to become healthy
        const healthy = await retrySleepService(PRODUCT_SERVICE, WORKER_URL);
        if (!healthy) {
          return res
            .status(503)
            .json({ message: "Product Service is temporarily unavailable." });
        }
        // 2. Only automatically retry GET requests
        if (req.method !== "GET") {
          return res
            .status(503)
            .json({ message: "Service is awake. Please retry your request." });
        }
        // 3. Retry the original GET request
        const response = await axios.get(
          `${PRODUCT_SERVICE}${req.originalUrl}`,
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
        console.error("Product retry failed:", retryError.message);
        if (!res.headersSent && !res.destroyed) {
          return res
            .status(503)
            .json({ message: "Product Service is temporarily unavailable." });
        }
      }
    },
  },
});
