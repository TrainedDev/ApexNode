import app from "./app.js";
import { config } from "dotenv";

const PORT = process.env.PORT || 5002;

config();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});