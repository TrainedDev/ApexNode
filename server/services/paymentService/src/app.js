import express from "express";
import paymentRoutes from "./routes/payment.routes.js";
import { paymentQueue } from "./queues/payment.queues.js";
import adminRoutes from "./routes/admin.routes.js";
import { globalError } from "./utils/handler.utils.js";
const app = express();

app.get("/api/v1/payment", (req, res) => res.send("payment server is live"))
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/payment", adminRoutes);

app.use(globalError);

export default app;
