import ioredis from "ioredis";
import { config } from "dotenv";

config();
const redisClient = new ioredis(process.env.IOREDIS_HOST, {
  maxRetriesPerRequest: null,
});

export default redisClient;
