import { Worker } from "bullmq";
import redisClient from "../config/redis.config.js";

import { processOrderPayment } from "./processOrderPayment.processors.js";
import { processReconcilePayment } from "./processReconcilePayment.processors.js";
import { processOrderRefund } from "./processOrderRefund.processors.js";

const workers = [];

function createWorker(queueName, processor, workerName) {
  const worker = new Worker(queueName, processor, {
    connection: redisClient,
  });

  worker.on("ready", () => {
    console.log(`✅ ${workerName} ready`);
  });

  worker.on("active", (job) => {
    console.log(`🔄 ${workerName}: processing ${job.id}`);
  });

  worker.on("completed", (job) => {
    console.log(`✅ ${workerName}: job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ ${workerName}: job ${job?.id} failed`);
    console.error(err);
  });

  worker.on("error", (err) => {
    console.error(`❌ ${workerName} error:`, err);
  });

  worker.on("stalled", (jobId) => {
    console.warn(`⚠️ ${workerName}: job ${jobId} stalled`);
  });

  workers.push(worker);

  return worker;
}

export const orderWorker = createWorker(
  "paymentQueue",
  async (job) => {
    console.log("Payment job:", job.data);

    await processOrderPayment(job.data);
  },
  "Payment Worker",
);

export const refundWorker = createWorker(
  "refundQueue",
  async (job) => {
    await processOrderRefund(job.data);
  },
  "Refund Worker",
);

export const verifyPaymentWorker = createWorker(
  "reconcilePaymentQueue",
  async (job) => {
    await processReconcilePayment(job.data);
  },
  "Recocile Payment Worker",
);

export const initiatePaymentWorker = createWorker(
  "initiatePaymentQueue",
  async (job) => {
    await processOrderPayment(job.data);
  },
  "Initiate Payment Worker",
);

console.log("🚀 All workers initialized");