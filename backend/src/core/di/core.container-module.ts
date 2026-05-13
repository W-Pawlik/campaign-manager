import type { Container } from "inversify";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { Logger } from "@core/application/logging/Logger";
import { coreConfig } from "@core/config/core.config";
import { CORE_TYPES } from "@core/di/core.types";
import { AsyncLocalStorageRequestContextStore } from "@core/infrastructure/context/AsyncLocalStorageRequestContextStore";
import { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";
import { PinoLogger } from "@core/infrastructure/logger/PinoLogger";

export function loadCoreContainerModule(container: Container): void {
  container
    .bind<RequestContextStore>(CORE_TYPES.RequestContextStore)
    .toDynamicValue(() => new AsyncLocalStorageRequestContextStore())
    .inSingletonScope();

  container
    .bind<Logger>(CORE_TYPES.Logger)
    .toDynamicValue((context) => {
      const requestContextStore = context.get<RequestContextStore>(CORE_TYPES.RequestContextStore);

      return new PinoLogger(requestContextStore, coreConfig.logger.level);
    })
    .inSingletonScope();

  container.bind<ErrorMapper>(CORE_TYPES.ErrorMapper).to(ErrorMapper).inSingletonScope();
}
