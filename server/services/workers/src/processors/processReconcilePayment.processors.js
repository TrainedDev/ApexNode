import { appError } from "../../utils/appError.js";
import { razorpayInstance } from "../config/razorpay.config.js";
import db from "../models/index.cjs";
import { initiatePaymentQueue } from "../queues/orderRefund.queues.js";

const { Order } = db;

export const processReconcilePayment = async (razorpay_order_id) => {
  try {
    const order = await Order.findOne({
      where: { razorpay_order_id },
    });

    if (order.paymentStatus === "paid" || order.paymentStatus === "failed") {
      console.log("Payment already processed");
      return;
    }

    const payments =
      await razorpayInstance.orders.fetchPayments(razorpay_order_id);

    if (!payments || !payments.items?.length) {
      appError("No Razorpay payment found for order");
    }

    // Find the payment you want to reconcile.
    const payment = payments.items.find(
      (item) =>
        item.status === "captured" ||
        item.status === "authorized" ||
        item.status === "failed",
    );

    if (!payment) {
      throw new Error("No recognizable payment found");
    }

    const getOrder = await Order.findOne({
      where: {
        razorpay_order_id,
      },
    });

    if (!getOrder) {
      throw new Error("Local order not found");
    }

    await initiatePaymentQueue.add("initiate_payment", {
      event: `payment.${payment.status}`,
      razorpay_order_id,
      razorpay_payment_id: payment.id,
      orderId: getOrder.id,
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
         jobId: `payment-${razorpay_payment_id}`,
        removeOnComplete: 100,
        removeOnFail: false,
    });
  } catch (error) {
    console.log("Payment reconciliation failed:", error);

    throw error;
  }
};
