import { Queue } from "bullmq";
import connection from "../config/redis.config.js";

export const refundQueue = new Queue("refundQueue", { connection });
export const initiatePaymentQueue = new Queue("initiatePaymentQueue", { connection });