import axios from "axios";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const retrySleepService = async (serviceUrl, workerUrl) => {
  const RETRIES = [0, 10000, 30000, 60000];

  for (const delay of RETRIES) {
    if (delay) {
      await sleep(delay);
    }

    try {
      await axios.get(`${serviceUrl}/health`, {
        timeout: 10000,
      });

      if (workerUrl) {
        await axios.get(`${workerUrl}/health`, {
          timeout: 10000,
        });
      }

      console.log(`${serviceUrl} is awake`);

      return true;
    } catch (error) {
      console.log(`${serviceUrl} is not ready, retrying...`, error.message);
    }
  }

  return false;
};
