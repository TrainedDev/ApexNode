import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (err) => {
    const config = err.config;

    const shouldRetry =
      err.response?.status === 503 ||
      err.response?.status === 502 ||
      !err.response;

    if (!shouldRetry) throw err;

    config._retryCount = config._retryCount || 0;

    if (config._retryCount >= 3) {
      window.dispatchEvent(new CustomEvent("server-wakeup-failed"));
      throw err;
    }

    config._retryCount++;

    window.dispatchEvent(new CustomEvent("server-waking-up"));

    await sleep(2000);

    return axiosInstance(config);
    // throw err;
  },
);
