import { verifyToken } from "@clerk/backend";
import { env } from "../config/env.js";

export async function requireClerkAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Sign in to continue with LumiBooks." });
  }

  if (!env.clerkSecretKey) {
    return res.status(500).json({ message: "Clerk authentication is not configured on the server." });
  }

  try {
    const claims = await verifyToken(token, { secretKey: env.clerkSecretKey });
    req.auth = {
      clerkId: claims.sub,
      sessionId: claims.sid,
      claims
    };
    return next();
  } catch {
    return res.status(401).json({ message: "Your LumiBooks session has expired. Please sign in again." });
  }
}
