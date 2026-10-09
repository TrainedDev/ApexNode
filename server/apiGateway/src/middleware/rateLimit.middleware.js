import rateLimit from "express-rate-limit";

const createLimiter = ({ name, limit, message }) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    handler: (req, res) => {
      console.warn(`[RATE_LIMIT:${name}]`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
      });

      res.status(429).json({
        status: 429,
        error: "RATE_LIMIT_EXCEEDED",
        limiter: name,
        message,
        path: req.originalUrl,
      });
    },
  });

// General API
export const generalLimiter = createLimiter({
  name: "GENERAL_API",
  limit: 500,
  message: "Too many general API requests. Please try again later.",
});

// Authentication / status
export const statusLimiter = createLimiter({
  name: "AUTH_STATUS",
  limit: 300,
  message:
    "Too many authentication or status requests. Please try again later.",
});

// User / profile
export const userLimiter = createLimiter({
  name: "USER_PROFILE",
  limit: 200,
  message: "Too many user requests. Please try again later.",
});

// Orders / cart
export const orderLimiter = createLimiter({
  name: "ORDERS_CART",
  limit: 200,
  message: "Too many order requests. Please try again later.",
});

// Payment
export const paymentLimiter = createLimiter({
  name: "PAYMENT",
  limit: 50,
  message: "Too many payment requests. Please try again later.",
});
