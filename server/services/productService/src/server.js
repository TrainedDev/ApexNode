import app from "./app.js";
import { config } from "dotenv";

const PORT = process.env.PORT || 5002;

config();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Product Server is running on port ${PORT}`);
});
