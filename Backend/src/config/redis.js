import Redis from "ioredis";
import { env } from "./env.js";

let client;
let restClient;

function getUpstashRestClient() {
  if (!env.upstashRedisRestUrl || !env.upstashRedisRestToken) return null;
  if (restClient) return restClient;

  async function command(args) {
    const response = await fetch(env.upstashRedisRestUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.upstashRedisRestToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args)
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.result ?? null;
  }

  restClient = {
    get: (key) => command(["GET", key]),
    set: (key, value, mode, seconds) => {
      if (mode === "EX" && seconds) return command(["SET", key, value, "EX", seconds]);
      return command(["SET", key, value]);
    }
  };
  return restClient;
}

export function getRedis() {
  const rest = getUpstashRestClient();
  if (rest) return rest;
  if (!env.redisUrl) return null;
  if (!env.redisUrl.startsWith("redis://") && !env.redisUrl.startsWith("rediss://")) return null;
  if (!client) client = new Redis(env.redisUrl, { maxRetriesPerRequest: 2 });
  return client;
}
