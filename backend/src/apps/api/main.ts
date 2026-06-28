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
import type { RedisClient } from "@core/infrastructure/redis/redis.client";
import { RedisShutdownHook } from "@core/infrastructure/shutdown/RedisShutdownHook";
import { loadAuthContainerModule } from "@modules/auth/auth.container-module";
import { loadCampaignsContainerModule } from "@modules/campaigns/campaigns.container-module";
import { loadCharactersContainerModule } from "@modules/characters/characters.container-module";
import { loadChronicleContainerModule } from "@modules/chronicle/chronicle.container-module";
import { loadExternalReferencesContainerModule } from "@modules/external-references/external-references.container-module";
import { loadFightTrackerContainerModule } from "@modules/fight-tracker/fight-tracker.container-module";
import { loadItemsContainerModule } from "@modules/items/items.container-module";
import { loadLocationsContainerModule } from "@modules/locations/locations.container-module";
import { loadMonstersContainerModule } from "@modules/monsters/monsters.container-module";
import { loadNotesContainerModule } from "@modules/notes/notes.container-module";
import { loadNpcsContainerModule } from "@modules/npcs/npcs.container-module";
import { loadQuestsContainerModule } from "@modules/quests/quests.container-module";
import { loadSessionsContainerModule } from "@modules/sessions/sessions.container-module";
import { loadUsersContainerModule } from "@modules/users/users.container-module";

async function bootstrap(): Promise<void> {
  const container = buildContainer(
    loadAuthContainerModule,
    loadUsersContainerModule,
    loadCampaignsContainerModule,
    loadCharactersContainerModule,
    loadChronicleContainerModule,
    loadExternalReferencesContainerModule,
    loadFightTrackerContainerModule,
    loadItemsContainerModule,
    loadLocationsContainerModule,
    loadMonstersContainerModule,
    loadNotesContainerModule,
    loadNpcsContainerModule,
    loadQuestsContainerModule,
    loadSessionsContainerModule,
    loadApiContainerModule,
  );
  const logger = container.get<Logger>(CORE_TYPES.Logger);
  const shutdownManager = container.get<ShutdownManager>(CORE_TYPES.ShutdownManager);
  const prismaClient = container.get<PrismaClient>(CORE_TYPES.PrismaClient);
  const redisClient = container.get<RedisClient>(CORE_TYPES.RedisClient);
  const app = createApiApp({ container });

  try {
    await prismaClient.$connect();
    logger.info("Database connected");
    await redisClient.connect();
    logger.info("Redis connected");
  } catch (error) {
    logger.error("Failed to connect infrastructure dependencies", { error });
    process.exit(1);
  }

  const server = app.listen(apiConfig.port, () => {
    logger.info("API listening", {
      port: apiConfig.port,
    });
  });

  shutdownManager.registerHook(new HttpServerShutdownHook(server));
  shutdownManager.registerHook(new RedisShutdownHook(redisClient));
  shutdownManager.registerHook(new PrismaShutdownHook(prismaClient));
  shutdownManager.installProcessHandlers();
}

void bootstrap();
