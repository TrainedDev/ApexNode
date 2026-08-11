import express from "express";
import redisClient from "./config/redis.config.js";
import "./processors/worker.js";
import { connectDb } from "./config/mongoDb.config.js";
import db from "./models/index.cjs";

const { sequelize } = db;

const app = express();
const PORT = process.env.PORT || 3000;

// Minimal health check for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "worker",
  });
});

app.listen(PORT, () => {
  console.log(`[Worker] Health server running on port ${PORT}`);
});

const startWorker = async () => {
  try {
    // Connect Supabase/PostgreSQL
    await sequelize.authenticate();
    console.log("[Worker] successfully connected to supabase database");

    // Connect MongoDB
    await connectDb();
    console.log("[Worker] successfully connected mongoDb database");

    // Redis events
    redisClient.on("connect", () => {
      console.log("[Worker] Connected to Redis");
    });

    redisClient.on("error", (err) => {
      console.error("[Worker] Failed to Connect Redis:", err);
    });

    redisClient.on("end", () => {
      console.log("[Worker] disconnected from redis");
    });

    redisClient.on("reconnecting", () => {
      console.log("[Worker] reconnecting redis");
    });

    console.log("[Worker] Worker is running and ready to process jobs");
  } catch (error) {
    console.error("[Error] Failed to Initialize worker", error);
    process.exit(1);
  }
};

startWorker();