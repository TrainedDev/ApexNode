import app from "./app.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 5004;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Payment service is running on port ${PORT}`),
);
