import type { Cache, CacheSetOptions } from "@core/application/cache/Cache";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";

export class RedisCache implements Cache {
  public constructor(private readonly redisClient: RedisClient) {}

  public async get<TValue>(key: string): Promise<TValue | null> {
    const rawValue = await this.redisClient.get(key);

    if (rawValue === null) {
      return null;
    }

    return JSON.parse(rawValue) as TValue;
  }

  public async set<TValue>(key: string, value: TValue, options?: CacheSetOptions): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (options?.ttlSeconds === undefined) {
      await this.redisClient.set(key, serializedValue);
      return;
    }

    await this.redisClient.set(key, serializedValue, { EX: options.ttlSeconds });
  }

  public async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
