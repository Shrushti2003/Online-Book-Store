import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  mongoose.set("strictQuery", true);
    // console.log("Mongo URI =", env.mongoUri);
  return mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
}
