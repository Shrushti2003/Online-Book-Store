import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const rootEnv = resolve(process.cwd(), "..", ".env");

if (existsSync(rootEnv)) {
  for (const line of readFileSync(rootEnv, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const key = match[1];
    const shouldLoad =
      key.startsWith("NEXT_PUBLIC_") ||
      ["CLERK_SECRET_KEY", "FRONTEND_URL"].includes(key);

    if (shouldLoad && !process.env[key]) {
      process.env[key] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" }
    ]
  }
};

export default nextConfig;
