import ioredis from "ioredis";
import { config } from "dotenv";

config();

const redis = new ioredis(process.env.IOREDIS_HOST, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting");
});

export default redis;
