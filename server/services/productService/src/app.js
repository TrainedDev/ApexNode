import express from "express";
import productRoute from "./routes/product.route.js";
import { errorHandler } from "./utils/handler.utils.js";
import { config } from "dotenv";
import { connectDb } from "./config/db.js";

config();

const app = express();
connectDb(process.env.MONGO_URI);

app.use(express.json());
app.use("/api/v1/inventory", productRoute);
app.use(errorHandler);

export default app;
