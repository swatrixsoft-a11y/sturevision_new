// Redis client using Upstash REST API (works in Edge & Node environments)
// For local dev without Redis, responses will just not be cached (graceful fallback)

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisRequest(command: string[]): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  try {
    const res = await fetch(`${REDIS_URL}/${command.join("/")}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

export const redis = {
  async get(key: string): Promise<string | null> {
    const result = await redisRequest(["GET", key]);
    return result as string | null;
  },

  async set(key: string, value: string, exSeconds?: number): Promise<void> {
    if (exSeconds) {
      await redisRequest(["SET", key, encodeURIComponent(value), "EX", String(exSeconds)]);
    } else {
      await redisRequest(["SET", key, encodeURIComponent(value)]);
    }
  },

  async del(key: string): Promise<void> {
    await redisRequest(["DEL", key]);
  },

  async incr(key: string): Promise<number> {
    const result = await redisRequest(["INCR", key]);
    return result as number;
  },
};
