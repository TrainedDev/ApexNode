import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";

config();
export const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
    pathRewrite: (path, req) => {
    return req.originalUrl;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.session?.user) {
        proxyReq.setHeader("x-user-id", req.session.userId);
      }
    },
    error: (err, req, res, target) => {
      console.error(`failed to reach target service ${target}`, err);

      res.writeHead(502, { "content-type": "application/json" });
      res.end({ error: `${err}` });
    },
  },
});
