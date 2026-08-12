import { config } from "dotenv";
import app from "./app.js";

config();

const PORT = process.env.PORT || 5003;

app.listen(PORT,"0.0.0.0" () => {
  console.log(`Order Server is running on port ${PORT}`);
});
