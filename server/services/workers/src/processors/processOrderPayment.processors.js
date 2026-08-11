import mongoose, { model } from "mongoose";
import { appError } from "../../utils/appError.js";
import db from "../models/index.cjs";
import Product from "../mongoModels/product.model.js";
import { PurchasedProducts } from "../mongoModels/purchasedProducts.model.js";
import { refundQueue } from "../queues/orderRefund.queues.js";
const { Order, OrderItem, sequelize } = db;

export const processOrderPayment = async ({
  event,
  orderId,
  razorpay_payment_id,
  razorpay_order_id,
}) => {
  if (!event || !razorpay_order_id || !razorpay_payment_id)
    appError("required date not found");
  try {
    const checkOrderStatus = await Order.findOne({
      where: { razorpay_order_id },
    });

    if (
      checkOrderStatus.paymentStatus === "paid" ||
      checkOrderStatus.paymentStatus === "failed"
    ) {
      console.log("Order status already updated");
      return;
    }

    if (event === "payment.failed") {
      await Order.update(
        {
          razorpay_payment_id,
          paymentStatus: "failed",
          orderStatus: "cancelled",
        },
        {
          where: {
            razorpay_order_id,
            paymentStatus: "pending",
          },
        },
      );
      return;
    }

    if (event !== "payment.captured") {
      return;
    }

    const fetchPurchasedProduct = await Order.findOne({
      where: { razorpay_order_id },
      include: [{ model: OrderItem, required: true }],
    });

    if (fetchPurchasedProduct.OrderItems.length === 0)
      appError("Order details not found");

    const purchaseId = `stock:${razorpay_order_id}`;

    const isPurchasedProductStockUpdated = await PurchasedProducts.findOne({
      purchaseProductsId: purchaseId,
    });

    if (!isPurchasedProductStockUpdated) {
      const session = await mongoose.startSession();
      try {
        const updatedProductsStock = [];

        await session.withTransaction(async () => {
          for (const item of fetchPurchasedProduct.OrderItems) {
            const product = await Product.findOneAndUpdate(
              { _id: item.productId, stock: { $gte: item.qty } },
              { $inc: { stock: -item.qty } },
              { session, new: true },
            );

            if (!product) {
              await refundQueue.add(
                "refund_queue",
                { razorpay_payment_id, razorpay_order_id, orderId },
                {
                  attempts: 3,
                  backoff: {
                    type: "exponential",
                    delay: 5000,
                  },
                  jobId:`refund-${razorpay_payment_id}`,
                  removeOnComplete: 100,
                  removeOnFailed: false,
                },
              );

              console.log(
                `Insufficient stock or product not found refund generated : ${item.productId}`,
              );
              return;
            }

            if (product.stock === 0) {
              await Product.updateOne(
                { _id: product._id },
                {
                  $set: {
                    availabilityStatus: "out_of_stock",
                  },
                },
                { session },
              );
            }
            updatedProductsStock.push({
              productId: product._id,
              updatedStock: product.stock,
            });
          }

          await PurchasedProducts.create(
            [
              {
                purchaseProductsId: purchaseId,
                products: updatedProductsStock,
              },
            ],
            { session },
          );
        });

        console.log("Product successfully updates");
      } catch (error) {
        console.log(`Failed to update stock: ${error}`);
        throw error;
      } finally {
        await session.endSession();
      }
    }
    if (event === "payment.captured") {
      await Order.update(
        {
          razorpay_payment_id,
          paymentStatus: "paid",
          orderStatus: "processing",
        },
        {
          where: {
            razorpay_order_id,
            paymentStatus: "pending",
          },
        },
      );
      return;
    }

    console.log(
      "Product Stocks And Payment and Order Status Updated Successfully",
    );
  } catch (error) {
    console.log(error);
    console.log("failed to update product stocks and payment, order status ");
    throw error;
  }
};
