import { createClient, type RedisClientType } from "redis";
import { coreConfig } from "@core/config/core.config";

export type RedisClient = RedisClientType;

export function createRedisClient(): RedisClient {
  return createClient({
    url: coreConfig.redis.url,
  });
}
