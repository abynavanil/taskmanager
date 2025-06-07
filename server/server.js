import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Update CORS to allow frontend domains (add your deployed frontend URL if needed)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://comfy-tapioca-74a575.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Add a simple health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Use process.env.PORT (Render sets this automatically)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});