// src/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security & Parsing
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://taskflow-mern-architecture.onrender.com",
      "https://taskflow-mern-architecture.vercel.app",
      "https://taskflow-mern-architecture-git-main-amanas96s-projects.vercel.app",
      "https://taskflow-mern-architecture-2edm46sft-amanas96s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global Error Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend 100% ready on port ${PORT}`));
