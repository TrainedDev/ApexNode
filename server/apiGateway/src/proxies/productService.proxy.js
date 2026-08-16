import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";

config();

const productServiceUrl = process.env.ORDER_SERVICE;


export const productProxy = createProxyMiddleware({
  target: productServiceUrl,
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
