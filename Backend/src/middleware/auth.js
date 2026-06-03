import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication is required to enter this shelf." });

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Your session key no longer opens this library." });
  }
}
