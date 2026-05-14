import { describe, expect, it, vi } from "vitest";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";
import { RedisShutdownHook } from "@core/infrastructure/shutdown/RedisShutdownHook";

describe("RedisShutdownHook", () => {
  it("quits redis connection when client is open", async () => {
    const redisClient = {
      isOpen: true,
      quit: vi.fn().mockResolvedValue("OK"),
    } as unknown as RedisClient;
    const hook = new RedisShutdownHook(redisClient);

    await hook.shutdown();

    expect(redisClient.quit).toHaveBeenCalledTimes(1);
  });

  it("does not quit redis connection when client is already closed", async () => {
    const redisClient = {
      isOpen: false,
      quit: vi.fn(),
    } as unknown as RedisClient;
    const hook = new RedisShutdownHook(redisClient);

    await hook.shutdown();

    expect(redisClient.quit).not.toHaveBeenCalled();
  });
});
