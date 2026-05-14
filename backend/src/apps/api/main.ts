import "reflect-metadata";
import { createApiApp } from "@api/app";
import { apiConfig } from "@api/config/api.config";
import { loadApiContainerModule } from "@api/di/api.container-module";
import type { ShutdownManager } from "@core/application/shutdown/ShutdownManager";
import { buildContainer } from "@core/di/container";
import { CORE_TYPES } from "@core/di/core.types";
import type { Logger } from "@core/application/logging/Logger";
import type { PrismaClient } from "@prisma/client";
import { HttpServerShutdownHook } from "@core/infrastructure/shutdown/HttpServerShutdownHook";
import { PrismaShutdownHook } from "@core/infrastructure/shutdown/PrismaShutdownHook";

async function bootstrap(): Promise<void> {
  const container = buildContainer(loadApiContainerModule);
  const logger = container.get<Logger>(CORE_TYPES.Logger);
  const shutdownManager = container.get<ShutdownManager>(CORE_TYPES.ShutdownManager);
  const prismaClient = container.get<PrismaClient>(CORE_TYPES.PrismaClient);
  const app = createApiApp({ container });

  try {
    await prismaClient.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error("Failed to connect to database", { error });
    process.exit(1);
  }

  const server = app.listen(apiConfig.port, () => {
    logger.info("API listening", {
      port: apiConfig.port,
    });
  });

  shutdownManager.registerHook(new HttpServerShutdownHook(server));
  shutdownManager.registerHook(new PrismaShutdownHook(prismaClient));
  shutdownManager.installProcessHandlers();
}

void bootstrap();
