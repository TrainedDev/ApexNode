import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Worker] Connected to MongoDB");
  } catch (error) {
    console.log("failed to connect mongodb:");
    console.log(error);
  }
};
