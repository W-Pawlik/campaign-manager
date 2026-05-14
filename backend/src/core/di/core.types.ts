export const CORE_TYPES = {
  Logger: Symbol.for("core.Logger"),
  RequestContextStore: Symbol.for("core.RequestContextStore"),
  ErrorMapper: Symbol.for("core.ErrorMapper"),
  PrismaClient: Symbol.for("core.PrismaClient"),
  RedisClient: Symbol.for("core.RedisClient"),
  Cache: Symbol.for("core.Cache"),
  DatabaseHealthChecker: Symbol.for("core.DatabaseHealthChecker"),
  TransactionManager: Symbol.for("core.TransactionManager"),
  HandlerResolver: Symbol.for("core.HandlerResolver"),
  CommandBus: Symbol.for("core.CommandBus"),
  QueryBus: Symbol.for("core.QueryBus"),
  ShutdownManager: Symbol.for("core.ShutdownManager"),
} as const;
