import mongoose from "mongoose";

export const connectDb = async (url) => {
  try {
    console.log("connecting to db");
    
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
