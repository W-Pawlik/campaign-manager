import "reflect-metadata";
import type { PrismaClient } from "@prisma/client";
import { runHealthCommand } from "@console/commands/health.command";
import { consoleAppConfig } from "@console/config/console-app.config";
import { ValidationError } from "@core/application/errors/AppError";
import type { Logger } from "@core/application/logging/Logger";
import type { ShutdownManager } from "@core/application/shutdown/ShutdownManager";
import { buildContainer } from "@core/di/container";
import { CORE_TYPES } from "@core/di/core.types";
import type { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";
import { PrismaShutdownHook } from "@core/infrastructure/shutdown/PrismaShutdownHook";
import { RedisShutdownHook } from "@core/infrastructure/shutdown/RedisShutdownHook";

async function run(): Promise<void> {
  const container = buildContainer();
  const logger = container.get<Logger>(CORE_TYPES.Logger);
  const errorMapper = container.get<ErrorMapper>(CORE_TYPES.ErrorMapper);
  const shutdownManager = container.get<ShutdownManager>(CORE_TYPES.ShutdownManager);
  const prismaClient = container.get<PrismaClient>(CORE_TYPES.PrismaClient);
  const redisClient = container.get<RedisClient>(CORE_TYPES.RedisClient);
  shutdownManager.registerHook(new RedisShutdownHook(redisClient));
  shutdownManager.registerHook(new PrismaShutdownHook(prismaClient));
  shutdownManager.installProcessHandlers();

  const command = process.argv[2] ?? "health";

  try {
    await prismaClient.$connect();
    await redisClient.connect();

    switch (command) {
      case "health":
        await runHealthCommand(logger);
        break;
      default:
        throw new ValidationError(`Unsupported console command: ${command}`);
    }

    const exitCode = await shutdownManager.shutdown("manual");
    process.exit(exitCode);
  } catch (error) {
    const mappedError = errorMapper.map(error);

    logger.error("Console command failed", {
      appName: consoleAppConfig.appName,
      command,
      error,
      mappedError,
    });

    const exitCode = await shutdownManager.shutdown("manual", error);
    process.exit(exitCode);
  }
}

void run();
