import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { config } from "dotenv";

config();

async function destroyGatewaySession(req, res) {
  if (req.session) {
    await new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
        resolve();
      });
    });
  }
  res.clearCookie("session-id", { path: '/' });
}

export const userProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE,
  changeOrigin: true,
  selfHandleResponse: true,
  pathRewrite: (path, req) => {
    return req.originalUrl;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (req.session?.userId) {
        proxyReq.setHeader("x-user-id", req.session.userId);
      }
    },
    proxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {

        const responseString = responseBuffer.toString("utf-8");

 try {
          const data = JSON.parse(responseString);

          if (data && data.userId) {
            req.session.userId = data.userId;
            await new Promise((resolve, reject) => {
              req.session.save((err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          }

          if (data && data.action === "LOGOUT") {
                if (req.originalUrl.includes('/logout')) {
                  await destroyGatewaySession(req, res);
                }
        }
          

           return JSON.stringify(data);
        } catch (error) {
          console.error("Proxy JSON Parse Error:", error);
             if (req.originalUrl.includes('/logout')) {
        await destroyGatewaySession(req, res);
      }
          return responseString;
        }
      },
    ),
    error: (err, req, res, target) => {
      console.log(`failed to reach target service: ${target}`, err);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error: err,
        }),
      );
    },
  },
});
