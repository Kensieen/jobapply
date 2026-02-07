import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import preferenceRoutes from "./routes/preferences.js";
import jobRoutes from "./routes/jobs.js";
import applyRoutes from "./routes/apply.js";
import applicationRoutes from "./routes/applications.js";
import { queueWorker } from "./services/queue.js";
import { requestLogger } from "./services/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);
app.use("/preferences", preferenceRoutes);
app.use("/jobs", jobRoutes);
app.use("/apply", applyRoutes);
app.use("/applications", applicationRoutes);

queueWorker();

app.listen(port, () => {
  console.log(`AutoApply AI backend running on ${port}`);
});
