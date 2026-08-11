import {
  createProductService,
  createBulkProductsService,
  getProductService,
  getAllProductsService,
  updateProductService,
  deleteProductService,
  getAllCartProductsService,
} from "../services/productController.service.js";
import { appError } from "../utils/appError.utils.js";
import { responseUser } from "../utils/responseUser.utils.js";
import { verifyReqData } from "../validations/verifyData.validations.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    appError(
      "request body cannot be empty at least required field should be present",
      400,
    );

  const { title, price, stock, images, thumbnail } = req.body;

  if (!title || !price || !stock || !thumbnail || !images)
    appError("required details are missing", 400);

  const response = await createProductService(req.body);

  responseUser(res, 201, response);
};

export const createBulkProducts = async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0)
    appError("required data is not array", 400);

  const response = await createBulkProductsService(products);

  responseUser(res, 201, response);
};

export const getAllProducts = async (req, res) => {
  const response = await getAllProductsService();

  responseUser(res, 200, response);
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id))
    appError("required data is not genuine", 400);

  const response = await getProductService(id);

  responseUser(res, 200, response);
};

export const fetchCartProducts = async (req, res) => {
  const { productIds } = req.body;
  const userId = req.header("x-user-id");

  if (!userId) appError("user not logged in or session expired", 401);

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0)
    appError("required data is invalid", 400);

  const response = await getAllCartProductsService(productIds);

  responseUser(res, 200, response);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id))
    appError("product is not valid", 400);

  const data = verifyReqData(req.body);

  if (Object.keys(data).length === 0)
    appError("request body cannot be empty. At least one field required", 400);

  const response = await updateProductService(data, id);

  responseUser(res, 200, response);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id))
    appError("required product is not genuine", 400);

  const response = await deleteProductService(id);

  responseUser(res, 204, response);
};
