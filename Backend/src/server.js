import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed. Starting API in degraded mode.", error);
  }

  app.listen(env.port, () => {
    console.log(`LumiBooks API listening on ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start LumiBooks API", error);
  process.exit(1);
});
