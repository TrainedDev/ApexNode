import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { config } from "dotenv";
import { wakeUpService } from "../middleware/serviceWakeUp.middleware.js";

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
  res.clearCookie("session-id", { path: "/" });
}


const userServiceUrl = process.env.ORDER_SERVICE;

export const userServiceWake = wakeUpService("userService", `${userServiceUrl}/health`);

export const userProxy = createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  selfHandleResponse: true,
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
            if (req.originalUrl.includes("/logout")) {
              await destroyGatewaySession(req, res);
            }
          }
          const { userId, ...responseData } = data;

          return JSON.stringify(responseData);
        } catch (error) {
          console.error("Proxy JSON Parse Error:", error);
          if (req.originalUrl.includes("/logout")) {
            await destroyGatewaySession(req, res);
          }
          return responseString;
        }
      },
    ),
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
