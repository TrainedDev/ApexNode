import { appError } from "../utils/appError.utils.js";
import db from "../models/index.cjs";
import { razorpayInstance } from "../config/razorpay.js";

import { config } from "dotenv";

config();

const { RAZORPAY_TEST_KEY } = process.env;
const { Order, sequelize, OrderItem } = db;

export const createOrderService = async (orderDetails, userId, address) => {
  const totalPrice = orderDetails.reduce(
    (acc, curr) => acc + curr.buyingPrice * 100 * curr.qty,
    0,
  );

  const options = {
    amount: totalPrice,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  if (!razorpayOrder) appError("failed to create order", 500);

  const orders = await sequelize.transaction(async (t) => {
    const newOrder = await Order.create(
      {
        userId,
        totalPrice: razorpayOrder.amount,
        address,
        razorpay_order_id: razorpayOrder.id,
      },
      { transaction: t },
    );

    const orderItems = orderDetails.map((ele) => ({
      ...ele,
      orderId: newOrder.id,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    return {newOrder, razorpayKeyId: RAZORPAY_TEST_KEY};
  });

  return {
    msg: "order successfully created",
    data: orders,
  };
};

export const fetchOrdersService = async (userId) => {
  const orders = await Order.findAll({ where: { userId }, include:[{
    model: OrderItem,
    required: true,
  }] });

  if (!orders || orders.length === 0) {
    appError("No orders found for the given user", 404);
  }

  return { msg: "orders fetched successfully", data: orders };
};
