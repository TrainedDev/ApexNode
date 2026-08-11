import mongoose from "mongoose";

const purchasedProductSchema = new mongoose.Schema({
  purchaseProductsId: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ecommerce_product",
        required: true,
      },
      updatedStock: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const PurchasedProducts = mongoose.model(
  "purchasedProduct",
  purchasedProductSchema,
);
