import { config } from "dotenv";
import app from "./app.js";

config();

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`ORDER SERVICE is running on port ${PORT}`);
});
