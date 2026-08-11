import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const redisClient = createClient({ url: process.env.REDIS_URL });

export const redisStore = new RedisStore({
  client: redisClient,
});

redisClient.on("connect", () => console.log("successfully connect to redis"));
redisClient.on("reconnecting", () => console.log(" reconnecting to redis"));
redisClient.on("error", () => console.log("failed to connect redis"));
redisClient.on("end", () => console.log("redis connection close"));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
