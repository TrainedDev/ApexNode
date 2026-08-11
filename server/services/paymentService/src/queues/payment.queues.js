import { Queue } from "bullmq";
import connection from "../config/ioredis.config.js";

export const paymentQueue = new Queue("paymentQueue", {connection});
export const refundQueue = new Queue("refundQueue", { connection });
export const reconcilePaymentQueue = new Queue("reconcilePaymentQueue", {connection});
export const initiatePaymentQueue = new Queue("initiatePaymentQueue", { connection });
