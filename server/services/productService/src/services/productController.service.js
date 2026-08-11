import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const createProductService = async (data) => {
  const product = await Product.create(data);

  return { msg: "product successfully created", data: product };
};

export const createBulkProductsService = async (data) => {
  const products = await Product.insertMany(data);

  return { msg: "products successfully created", data: products };
};

export const getAllProductsService = async () => {
  const products = await Product.find();

  return { msg: "products successfully fetched", data: products };
};

export const getProductService = async (id) => {
  const product = await Product.findById(id);

  return { msg: "product successfully fetched", data: product };
};

export const getAllCartProductsService = async (productIds) => {
  console.log(productIds);
  
  const fetchGenuineProductIds = productIds.filter((id) => mongoose.isObjectIdOrHexString(id));
  const bulkProducts = await Product.find({ _id: {$in: fetchGenuineProductIds} });
console.log(bulkProducts);

  return { msg: "products successfully fetched", data: bulkProducts };
};

export const updateProductService = async (data, id) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return { msg: "product successfully updated", data: product };
};

export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  return { msg: "product successfully deleted" };
};
