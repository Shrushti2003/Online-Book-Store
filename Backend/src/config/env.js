import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "..", ".env"),
  resolve(process.cwd(), "Backend", ".env")
].filter((path, index, all) => all.indexOf(path) === index);

for (const path of envPaths) {
  if (existsSync(path)) {
    dotenv.config({ path, override: false });
  }
}

const geminiApiKey =
  process.env.GEMINI_API_KEY ??
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
  process.env.GOOGLE_AI_API_KEY ??
  process.env.NEXT_PUBLIC_GEMINI_API_KEY;

function cleanEnv(value) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/lumibooks",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  googleBooksApiKey: cleanEnv(process.env.GOOGLE_BOOKS_API_KEY),
  openAiApiKey: cleanEnv(process.env.OPENAI_API_KEY),
  geminiApiKey: cleanEnv(geminiApiKey),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  redisUrl: cleanEnv(process.env.REDIS_URL ?? process.env.UPSTASH_REDIS_REDIS_URL),
  upstashRedisRestUrl: cleanEnv(process.env.UPSTASH_REDIS_REST_URL),
  upstashRedisRestToken: cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN),
  cloudinaryCloudName: cleanEnv(process.env.CLOUDINARY_CLOUD_NAME),
  cloudinaryApiKey: cleanEnv(process.env.CLOUDINARY_API_KEY),
  cloudinaryApiSecret: cleanEnv(process.env.CLOUDINARY_API_SECRET),
  clerkSecretKey: cleanEnv(process.env.CLERK_SECRET_KEY)
};
