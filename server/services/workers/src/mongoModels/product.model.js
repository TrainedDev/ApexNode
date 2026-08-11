import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
  },
  description: String,
  price: mongoose.Schema.Types.Decimal128,
  discountPercentage: mongoose.Schema.Types.Decimal128,
  rating: Number,
  stock: {
    type: Number,
    required: true,
  },
  tags: [String],
  brand: String,
  sku: String,
  weight: Number,
  dimensions: {
    type: mongoose.Schema.Types.Mixed,
  },
  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String,
  reviews: [Object],
  returnPolicy: String,
  minimumOrderQuantity: Number,
  meta: {
    type: mongoose.Schema.Types.Mixed,
  },
  images: {
    type: [String],
  },
  thumbnail: {
    type: String,
    trim: true,
  },
});

const Product = mongoose.model("ecommerce_product", productSchema);

export default Product;
