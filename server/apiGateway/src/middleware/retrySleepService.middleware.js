import axios from "axios";
import { config } from "dotenv";

config();

const { WORKER_URL } = process.env;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const retrySleepService = (serviceUrl) => {
  return async (req, res, next) => {
    const RETRIES = [0, 10000, 30000, 60000];

    for (const delay of RETRIES) {
      try {
        if (delay) {
          await sleep(delay);
        }

        await axios.get(`${serviceUrl}/health`, {
          timeout: 10000,
        });

        await axios.get(`${WORKER_URL}/health`, {
          timeout: 10000,
        });

        console.log(`${serviceUrl} is awake`);

        return next();
      } catch (error) {
        console.log(`${serviceUrl} is not ready, retrying...`);
      }
    }

    return res.status(503).json({
      message: "Service is temporarily unavailable",
    });
  };
};
