import redisClient from "./config/redis.config.js";
import "./processors/worker.js";
import { connectDb } from "./config/mongoDb.config.js";
import db from "./models/index.cjs";

const { sequelize } = db;
console.log("checking am i running");

const startWorker = async () => {
  try {
    // connect supabase
    sequelize
      .authenticate()
      .then(() =>
        console.log("[Worker] successfully connected to supabase database"),
      )
      .catch((err) => console.log(`[Worker] failed to connect supabase database: ${err}`));

    // connect mongodb
    connectDb();
    console.log("[Worker]successfully connected mongoDb database");

    // connect redis
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
    console.error("[Error] Failed to Initialized worker", error);
    process.exit(1);
  }
};

startWorker();
