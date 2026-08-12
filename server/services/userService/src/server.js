import app from "./app.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`User server is running on ${PORT}`),
);
