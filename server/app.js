import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.js";
import agentRoutes from "./routes/agent.js";
import managerRoutes from "./routes/manager.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "server",
      "uploads"
    )
  )
);

app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FieldOps API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    name: "FieldOps Recovery Operations API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      manager: "/api/manager",
      agent: "/api/agent",
      messages: "/api/messages",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((error, req, res, next) => {
  console.error("FIELDOPS SERVER ERROR:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;