import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  statusCode: 429,
  message: {
    status: 429,
    error: "request limit reached",
    // message: error.message,
  },
});
