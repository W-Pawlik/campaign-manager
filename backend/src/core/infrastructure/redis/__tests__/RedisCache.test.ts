import { describe, expect, it, vi } from "vitest";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";
import { RedisCache } from "@core/infrastructure/redis/RedisCache";

function createRedisClientMock(): RedisClient {
  return {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  } as unknown as RedisClient;
}

describe("RedisCache", () => {
  it("returns null when key does not exist", async () => {
    const redisClient = createRedisClientMock();
    vi.mocked(redisClient.get).mockResolvedValue(null);
    const cache = new RedisCache(redisClient);

    const value = await cache.get("missing-key");

    expect(value).toBeNull();
    expect(redisClient.get).toHaveBeenCalledWith("missing-key");
  });

  it("parses cached JSON values", async () => {
    const redisClient = createRedisClientMock();
    vi.mocked(redisClient.get).mockResolvedValue('{"foo":"bar"}');
    const cache = new RedisCache(redisClient);

    const value = await cache.get<{ foo: string }>("foo");

    expect(value).toEqual({ foo: "bar" });
  });

  it("stores values without ttl by default", async () => {
    const redisClient = createRedisClientMock();
    vi.mocked(redisClient.set).mockResolvedValue("OK");
    const cache = new RedisCache(redisClient);

    await cache.set("key", { value: 123 });

    expect(redisClient.set).toHaveBeenCalledWith("key", '{"value":123}');
  });

  it("stores values with ttl when provided", async () => {
    const redisClient = createRedisClientMock();
    vi.mocked(redisClient.set).mockResolvedValue("OK");
    const cache = new RedisCache(redisClient);

    await cache.set("key", "value", { ttlSeconds: 60 });

    expect(redisClient.set).toHaveBeenCalledWith("key", '"value"', { EX: 60 });
  });

  it("deletes cache entries", async () => {
    const redisClient = createRedisClientMock();
    vi.mocked(redisClient.del).mockResolvedValue(1);
    const cache = new RedisCache(redisClient);

    await cache.delete("key");

    expect(redisClient.del).toHaveBeenCalledWith("key");
  });
});
