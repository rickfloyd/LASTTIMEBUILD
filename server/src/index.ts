import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { healthRouter } from "./routes/health";
import { newsRouter } from "./routes/news";
import { aiRouter } from "./routes/ai";

const app = express();
const PORT = Number(process.env.PORT || 5050);

// Security + parsing
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// CORS (safe defaults for dev + workstation)
app.use(
  cors({
    origin: true,
    credentials: false
  })
);

app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRouter);
app.use("/api/news", newsRouter);
app.use("/api/ai", aiRouter);

// 404
app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

app.listen(PORT, () => {
  console.log(`✅ OGAIQCHARTS backend listening on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
