// server.js - Entry point for the standalone Express + MongoDB backend
// How to run (quick start):
// - Local dev (Windows/macOS/Linux):
//   pnpm install
//   pnpm run dev:server:local
//   -> Uses: MONGODB_URI=mongodb://localhost:27017/forensiq and PORT=5000
//
// How to run (with .env):
// 1) Copy docs/env.example to .env (project root) and set MONGODB_URI, PORT
// 2) Install deps: pnpm install
// 3) Start dev: pnpm run dev:server (nodemon) or start once: pnpm run server
// 4) API base URL: http://localhost:5000 (or PORT in .env)

import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { connectToDatabase } from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", chatRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler (basic)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

export default app;


