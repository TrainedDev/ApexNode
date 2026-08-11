import {
  createCartService,
  getCartService,
  removeProductFromCartService,
  clearCartService,
  updateCartService,
} from "../services/cartController.services.js";
import { appError } from "../utils/appError.utils.js";
import { responseUser } from "../utils/responseUser.utils.js";

export const createCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  if (!productId) appError("required details not found", 400);

  const response = await createCartService(userId, productId);

  responseUser(res, 201, response);
};

export const updateCart = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  if (!productId || !quantity) appError("required details not found", 400);

  const response = await updateCartService(userId, productId, quantity);

  responseUser(res, 200, response);
};

export const fetchCart = async (req, res) => {
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  const response = await getCartService(userId);

  responseUser(res, 200, response);
};

export const removeProductFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  if (!productId) appError("required data not found", 400);

  const response = await removeProductFromCartService(userId, productId);

  responseUser(res, 200, response);
};

export const clearCart = async (req, res) => {
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  const response = await clearCartService(userId);

  responseUser(res, 200, response);
};
