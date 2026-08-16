import { appError } from "../utils/appError.utils.js";
import { config } from "dotenv";
import crypto from "crypto";
import { paymentQueue, reconcilePaymentQueue } from "../queues/payment.queues.js";

config();

const { RAZORPAY_TEST_SECRET_KEY, RAZORPAY_TEST_WEBHOOK_SECRET_KEY } =
  process.env;

export const verifyPaymentService = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId,
) => {
  const expectRazorpaySignature = crypto
    .createHmac("sha256", RAZORPAY_TEST_SECRET_KEY)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectRazorpaySignature !== razorpay_signature) {
    reconcilePaymentQueue.add("reconcile_payment", razorpay_order_id, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      jobId: `reconcile-${razorpay_order_id}`,
      removeOnComplete: 100,
      removeOnFail: false,
    });
    appError("payment verification failed: Invalid Signature", 400);
  }

  const data = {
    razorpay_payment_id,
    razorpay_order_id,
    orderId,
    event: "payment.captured",
  };

  await paymentQueue.add("payment_queue", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    jobId: `payment-${razorpay_payment_id}`,
    removeOnComplete: 100,
    removeOnFail: false,
  });

  return { success: true, razorpayOrderId: razorpay_order_id };
};

export const razorpayWebHookService = async (rawData, headers) => {
  const razorpayWebHookSignature = headers["x-razorpay-signature"];

  const expectRazorpaySignature = crypto
    .createHmac("sha256", RAZORPAY_TEST_WEBHOOK_SECRET_KEY)
    .update(rawData)
    .digest("hex");
  console.log(expectRazorpaySignature, " ===", razorpayWebHookSignature);

  if (expectRazorpaySignature !== razorpayWebHookSignature) {
    reconcilePaymentQueue.add("reconcile_payment", razorpay_order_id, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      jobId: `reconcile-${razorpay_order_id}`,
      removeOnComplete: 100,
      removeOnFail: false,
    });
    appError("payment verification failed: Invalid Signature", 400);
  }

  const paymentData = JSON.parse(rawData);

  const {
    event,
    payload: {
      payment: {
        entity: { id: razorpay_payment_id, order_id: razorpay_order_id },
      },
    },
  } = paymentData;

  const data = {
    event,
    razorpay_order_id,
    razorpay_payment_id,
  };

  if (paymentData.event === "payment.captured")
    await paymentQueue.add("payment_queue", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      jobId: `payment-${razorpay_payment_id}`,
      removeOnComplete: 100,
      removeOnFail: false,
    });
  return { msg: "payment success", data: paymentData.payload.payment.entity };
};
