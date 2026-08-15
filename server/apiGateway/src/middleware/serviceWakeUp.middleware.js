import axios from "axios";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const serviceState = new Map();

const RETRY_DELAYS = [3000, 7000, 15000];

export const wakeUpService = (serviceName, serviceUrl) => {
  return async (req, res, next) => {
    // Only automatically wake services for safe requests
    if (!["GET", "HEAD"].includes(req.method)) {
      return next();
    }

    // Check whether service was recently confirmed as awake
    const state = serviceState.get(serviceName);

    if (state?.awake && Date.now() - state.checkedAt < 30_000) {
      return next();
    }

    // First health check
    try {
      const response = await axios.get(serviceUrl, {
        timeout: 5000,
      });

      if (response.status >= 200 && response.status < 300) {
        serviceState.set(serviceName, {
          awake: true,
          checkedAt: Date.now(),
        });

        return next();
      }
    } catch (error) {
      console.log(
        `${serviceName} health check failed:`,
        error.code || error.message,
      );
    }

    // Retry health check
    for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
      await sleep(RETRY_DELAYS[attempt]);

      try {
        const response = await axios.get(serviceUrl, {
          timeout: 10_000,
        });

        if (response.status >= 200 && response.status < 300) {
          serviceState.set(serviceName, {
            awake: true,
            checkedAt: Date.now(),
          });

          return next();
        }
      } catch (error) {
        console.log(
          `${serviceName} health check failed:`,
          error.code || error.message,
        );
      }
    }

    serviceState.set(serviceName, {
      awake: false,
      checkedAt: Date.now(),
    });

    return res.status(503).json({
      message: `${serviceName} service is temporarily unavailable`,
    });
  };
};
