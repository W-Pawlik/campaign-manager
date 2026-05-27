import type { Container } from "inversify";
import { S3Client } from "@aws-sdk/client-s3";
import type { PrismaClient } from "@prisma/client";
import type { RedisClient } from "@core/infrastructure/redis/redis.client";
import type { Cache } from "@core/application/cache/Cache";
import type { DatabaseHealthChecker } from "@core/application/database/DatabaseHealthChecker";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { TransactionManager } from "@core/application/database/TransactionManager";
import type { FileStorage } from "@core/application/storage/FileStorage";
import type { Logger } from "@core/application/logging/Logger";
import { CommandBus } from "@core/application/cqrs/CommandBus";
import type { HandlerResolver } from "@core/application/cqrs/HandlerResolver";
import { QueryBus } from "@core/application/cqrs/QueryBus";
import { ShutdownManager } from "@core/application/shutdown/ShutdownManager";
import { coreConfig } from "@core/config/core.config";
import { CORE_TYPES } from "@core/di/core.types";
import { AsyncLocalStorageRequestContextStore } from "@core/infrastructure/context/AsyncLocalStorageRequestContextStore";
import { createPrismaClient } from "@core/infrastructure/database/prisma.client";
import { PrismaDatabaseHealthChecker } from "@core/infrastructure/database/PrismaDatabaseHealthChecker";
import { PrismaTransactionManager } from "@core/infrastructure/database/PrismaTransactionManager";
import { InversifyHandlerResolver } from "@core/infrastructure/di/InversifyHandlerResolver";
import { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";
import { PinoLogger } from "@core/infrastructure/logger/PinoLogger";
import { RedisCache } from "@core/infrastructure/redis/RedisCache";
import { createRedisClient } from "@core/infrastructure/redis/redis.client";
import { S3FileStorage } from "@core/infrastructure/storage/S3FileStorage";

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
  container
    .bind<PrismaClient>(CORE_TYPES.PrismaClient)
    .toDynamicValue(() => createPrismaClient())
    .inSingletonScope();
  container
    .bind<RedisClient>(CORE_TYPES.RedisClient)
    .toDynamicValue(() => createRedisClient())
    .inSingletonScope();
  container
    .bind<S3Client>(CORE_TYPES.S3Client)
    .toDynamicValue(() => new S3Client({ region: coreConfig.aws.region }))
    .inSingletonScope();
  container
    .bind<Cache>(CORE_TYPES.Cache)
    .toDynamicValue((context) => {
      const redisClient = context.get<RedisClient>(CORE_TYPES.RedisClient);

      return new RedisCache(redisClient);
    })
    .inSingletonScope();
  container
    .bind<FileStorage>(CORE_TYPES.FileStorage)
    .toDynamicValue((context) => {
      const s3Client = context.get<S3Client>(CORE_TYPES.S3Client);

      return new S3FileStorage(s3Client, {
        bucket: coreConfig.aws.s3Bucket,
        region: coreConfig.aws.region,
      });
    })
    .inSingletonScope();
  container
    .bind<TransactionManager>(CORE_TYPES.TransactionManager)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaTransactionManager(prismaClient);
    })
    .inSingletonScope();
  container
    .bind<DatabaseHealthChecker>(CORE_TYPES.DatabaseHealthChecker)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaDatabaseHealthChecker(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<HandlerResolver>(CORE_TYPES.HandlerResolver)
    .toDynamicValue(() => new InversifyHandlerResolver(container))
    .inSingletonScope();

  container
    .bind<CommandBus>(CORE_TYPES.CommandBus)
    .toDynamicValue((context) => {
      const handlerResolver = context.get<HandlerResolver>(CORE_TYPES.HandlerResolver);

      return new CommandBus(handlerResolver);
    })
    .inSingletonScope();

  container
    .bind<QueryBus>(CORE_TYPES.QueryBus)
    .toDynamicValue((context) => {
      const handlerResolver = context.get<HandlerResolver>(CORE_TYPES.HandlerResolver);

      return new QueryBus(handlerResolver);
    })
    .inSingletonScope();

  container
    .bind<ShutdownManager>(CORE_TYPES.ShutdownManager)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(CORE_TYPES.Logger);

      return new ShutdownManager(logger);
    })
    .inSingletonScope();
}
