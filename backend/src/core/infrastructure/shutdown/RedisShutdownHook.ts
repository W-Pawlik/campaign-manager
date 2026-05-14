import type { ShutdownHook } from "@core/application/shutdown/ShutdownHook";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";

export class RedisShutdownHook implements ShutdownHook {
  public readonly name = "RedisShutdownHook";

  public constructor(private readonly redisClient: RedisClient) {}

  public async shutdown(): Promise<void> {
    if (this.redisClient.isOpen) {
      await this.redisClient.quit();
    }
  }
}
