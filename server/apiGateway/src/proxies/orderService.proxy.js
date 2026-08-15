import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";
import { wakeUpService } from "../middleware/serviceWakeUp.middleware.js";

config();

const orderServiceUrl = process.env.ORDER_SERVICE;

export const orderServiceWake = wakeUpService("orderService", `${orderServiceUrl}/health`);


export const orderProxy = createProxyMiddleware({
  target: orderServiceUrl,
  changeOrigin: true,
  proxyTimeout: 70000,
  timeout: 70000,
  pathRewrite: (path, req) => {
    return req.originalUrl;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.session?.userId) {
        proxyReq.setHeader("x-user-id", req.session.userId);
      }
    },
    error: (err, req, res, target) => {
      console.error(`Failed to reach product service ${target}:`, err.message);

      if (!res.headersSent) {
        res.status(503).json({
          message: "Product service is waking up. Please try again shortly.",
        });
      }
    },
  },
});
