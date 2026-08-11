import session from "express-session";
import { redisStore } from "../config/redis.js";
import { config } from "dotenv";

config();

export const userSession = session({
  name: "session-id",
  secret: process.env.SESSION_SECRET,
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
});
