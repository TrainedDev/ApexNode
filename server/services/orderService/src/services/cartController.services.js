import db from "../models/index.cjs";
import { appError } from "../utils/appError.utils.js";

const { Cart, sequelize } = db;

const fetchUserCart = async (userId, t) => {
  const cart = await Cart.scope([
    { method: ["fetchAllProductsInCart", userId] },
  ]).findAll({ transaction: t });
  return cart;
};

export const createCartService = async (userId, productId) => {
  const cart = await sequelize.transaction(async (t) => {
    const fetchCart = await fetchUserCart(userId, t);

    const isProductInCart = fetchCart.find(
      (cart) => cart.productId === productId,
    );

    if (isProductInCart) appError("product already in cart", 400);

    if (fetchCart.length > 10) appError("cart limit exceeded 10", 400);

    const userCart = await Cart.create({ userId, productId });

    return userCart;
  });

  return { msg: "product successfully added", data: cart };
};

export const getCartService = async (userId) => {
  const cart = await Cart.scope([
    { method: ["fetchAllProductsInCart", userId] },
  ]).findAll();

  return { msg: "cart successfully fetched", data: cart };
};

export const removeProductFromCartService = async (userId, productId) => {
  const cart = await sequelize.transaction(async (t) => {
    await Cart.scope([
      { method: ["fetchProductInCart", userId, productId] },
    ]).destroy({ transaction: t });

    const userCart = await fetchUserCart(userId, t);

    return userCart;
  });

  return { msg: "product successfully removed", data: cart };
};

export const updateCartService = async (userId, productId, quantity) => {
  const cart = await sequelize.transaction(async (t) => {
    const fetchCart = await fetchUserCart(userId, t);

    const isProductInCart = fetchCart.find(
      (cart) => cart.productId === productId,
    );

    if (!isProductInCart) appError("product not found in cart", 404);

    await Cart.scope([
      { method: ["fetchProductInCart", userId, productId] },
    ]).update({ quantity }, { transaction: t });

    const userCart = await fetchUserCart(userId, t);

    return userCart;
  });

  return { msg: "product successfully updated", data: cart };
};

export const clearCartService = async (userId) => {
  const cart = await sequelize.transaction(async (t) => {
    await Cart.scope([{ method: ["fetchAllProductsInCart", userId] }]).destroy({
      transaction: t,
    });
    const userCart = await fetchUserCart(userId, t);
    return userCart;
  });

  return { msg: "cart successfully cleared", data: cart };
};
