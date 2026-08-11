import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";

config();

export const productProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE,
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
      console.error(`failed to reach target ${target} service`, err);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err }));
    },
  },
});
