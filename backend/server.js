import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
