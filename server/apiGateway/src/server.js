import express from "express";
import cors from "cors";
import servicesProxy from "./routes/service.route.js";
import { userSession } from "./middleware/authVerify.middleware.js";
import { connectRedis } from "./config/redis.js";
import { config } from "dotenv";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);

connectRedis();

app.use(userSession);
app.use(servicesProxy);

app.get("/", (req, res) => res.send("apigatway is live"));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", console.log("Api gateway is running on port:", PORT));
