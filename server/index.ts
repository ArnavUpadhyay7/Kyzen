import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route";
import taskRoutes from "./routes/task.route";
import { getDashboard } from "./controllers/dashboard.controller";
import { requireAuth } from "./middleware/auth.middleware";
import "./cron/expireTasks";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "API is running." });
});

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/tasks",     requireAuth, taskRoutes);
app.get("/api/dashboard", requireAuth, getDashboard);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});