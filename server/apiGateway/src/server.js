import express from "express";
import cors from "cors";
import servicesProxy from "./routes/service.route.js";
import { userSession } from "./middleware/authVerify.middleware.js";
import { rateLimiter } from "./middleware/rateLimit.middleware.js";
import { connectRedis } from "./config/redis.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Your Vite app URL
  credentials: true,
}));

connectRedis();

app.use(userSession);
app.use(rateLimiter);
app.use(servicesProxy);

app.get("/", (req, res) => res.send("APIGATEWAY is live"));

app.listen(PORT, console.log("Api gateway is running on port:", PORT));
