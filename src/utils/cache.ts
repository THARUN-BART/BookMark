import { redis } from "../config/redis";

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFromDb: () => Promise<T>
): Promise<T> {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
  } catch (error) {
    console.warn(`Redis read failed for key "${key}", falling back to DB:`, error);
  }

  const freshData = await fetchFromDb();

  try {
    await redis.set(key, JSON.stringify(freshData), "EX", ttlSeconds);
  } catch (error) {
    console.warn(`Redis write failed for key "${key}":`, error);
  }

  return freshData;
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.warn(`Redis delete failed for key "${key}":`, error);
  }
}
