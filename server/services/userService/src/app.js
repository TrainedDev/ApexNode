import express from "express";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./utils/handler.utils.js";
import { config } from "dotenv";
import db from "./models/index.cjs";
import cors from "cors";
config();

const app = express();

const { sequelize } = db;

app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => console.log("successfully connected to the database"))
  .catch((err) => console.log(`failed to connect to the database: ${err.name}`));

export default app;
