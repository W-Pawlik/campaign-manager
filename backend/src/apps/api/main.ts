import "reflect-metadata";
import { createApiApp } from "@api/app";
import { apiConfig } from "@api/config/api.config";
import { loadApiContainerModule } from "@api/di/api.container-module";
import { buildContainer } from "@core/di/container";
import { CORE_TYPES } from "@core/di/core.types";
import type { Logger } from "@core/application/logging/Logger";

const container = buildContainer(loadApiContainerModule);
const logger = container.get<Logger>(CORE_TYPES.Logger);
const app = createApiApp({ container });

app.listen(apiConfig.port, () => {
  logger.info("API listening", {
    port: apiConfig.port,
  });
});
