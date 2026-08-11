import {
  createOrderService,
  fetchOrdersService,
} from "../services/orderController.services.js";
import { appError } from "../utils/appError.utils.js";
import { responseUser } from "../utils/responseUser.utils.js";
import { orderValidation } from "../validations/orderData.validations.js";

export const createOrder = async (req, res) => {
  const { orderDetails, address } = req.body;
  const userId = req.header("x-user-id");
  const verifyOrder = orderValidation(orderDetails);

  if (!userId) appError("session expired, please login again", 401);
  if (!verifyOrder || !address)
    appError("required details not found or invalid", 400);

  const response = await createOrderService(orderDetails, userId, address);

  responseUser(res, 201, response);
};

export const fetchOrders = async (req, res) => {
  const userId = req.header("x-user-id");

  if (!userId) appError("required details not found", 400);

  const response = await fetchOrdersService(userId);

  responseUser(res, 200, response);
};
