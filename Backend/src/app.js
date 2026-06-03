import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "12mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lumibooks-api" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
