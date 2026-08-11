import { appError } from "../../utils/appError.js";
import { razorpayInstance } from "../config/razorpay.config.js";
import db from "../models/index.cjs";

const { Order } = db;

const updateOrderTable = async ({
  razorpay_order_id,
  razorpay_refund_id,
  razorpay_payment_id,
  orderId,
  refundStatus,
  orderStatus,
  paymentStatus,
}) => {
  const updateData = {
    refundStatus,
    razorpay_payment_id,
    paymentStatus,
    orderStatus,
  };

  if (razorpay_refund_id) {
    updateData.razorpay_refund_id = razorpay_refund_id;
  }

  await Order.update(updateData, {
    where: {
      id: orderId,
      razorpay_order_id,
    },
  });
};


export const processOrderRefund = async ({
  razorpay_payment_id,
  orderId,
  razorpay_order_id,
}) => {
  try {
    // Fetch the actual Razorpay payment
    const payment =
      await razorpayInstance.payments.fetch(
        razorpay_payment_id,
      );

    if (!payment) {
      appError(
        "Razorpay payment details not found",
      );
    }

    if (payment.status !== "captured") {
      appError(
        `Cannot refund payment with status: ${payment.status}`,
      );
    }

    const paymentId = payment.id;
    const amount = payment.amount;

    // Create refund
    const refund =
      await razorpayInstance.payments.refund(
        paymentId,
        {
          amount,
          speed: "normal",
        },
      );

    if (!refund) {
      appError(
        "Razorpay refund response not received",
      );
    }

    // Refund failed
    if (refund.status === "failed") {
      await updateOrderTable({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_refund_id: refund.id,
        orderId,
        refundStatus: "failed",
        paymentStatus: "paid",
        orderStatus: "cancelled",
      });

      console.log(
        "Refund failed. Manual investigation may be required.",
      );

      return;
    }

    // Refund successfully created/processed
    await updateOrderTable({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_refund_id: refund.id,
      orderId,

      refundStatus: "processed",

      paymentStatus: "refunded",

      orderStatus: "processing",
    });

    console.log(
      `Refund ${refund.id} successfully processed`,
    );

  } catch (error) {
    console.error(
      "Failed to refund payment:",
      error,
    );
    throw error;
  }
};