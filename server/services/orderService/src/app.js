import express from "express";
// import cors from "cors";
import cartRoute from "./routes/cart.routes.js";
import db from "./models/index.cjs";
import orderRoute from "./routes/order.routes.js";
import { errorHandler } from "./utils/handler.utils.js";

const app = express();
const { sequelize } = db;

app.use((req, res, next) => {
  console.log("Request received at order service:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Order service is running");
});
app.use(express.json());

app.use("/api/v1/checkout", cartRoute);
app.use("/api/v1/checkout", orderRoute);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

app.use(errorHandler);

export default app;
