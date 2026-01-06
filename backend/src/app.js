import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import menuRoutes from "./routes/menuRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/menu", menuRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
