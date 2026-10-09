import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { config } from "dotenv";
import { retrySleepService } from "../middleware/retrySleepService.middleware.js";

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
        proxyReq.setHeader("x-user-id",  req.session.userId);
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
    error: async (err, req, res) => {
      console.error("User proxy failed:", err.message);
      if (res.headersSent || res.destroyed) return;
      try {
        // 1. Wait for User Service to become healthy
        const healthy = await retrySleepService(USER_SERVICE);
        if (!healthy) {
          return res
            .status(503)
            .json({ message: "User Service is temporarily unavailable." });
        }
        // 2. Only automatically retry GET requests
        if (req.method !== "GET") {
          return res
            .status(503)
            .json({ message: "Service is awake. Please retry your request." });
        }
        // 3. Retry the original GET request
        const response = await axios.get(`${User_SERVICE}${req.originalUrl}`, {
          headers: {
            ...(req.session?.userId && { "x-user-id": req.session.userId }),
          },
          timeout: 15000,
        });
        // // 4. Return the downstream response
        if (!res.headersSent && !res.destroyed) {
          return res.status(response.status).send(response.data);
        }
      } catch (retryError) {
        console.error("User retry failed:", retryError.message);
        if (!res.headersSent && !res.destroyed) {
          return res
            .status(503)
            .json({ message: "User Service is temporarily unavailable." });
        }
      }
    },
  },
});
