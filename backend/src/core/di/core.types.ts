export const CORE_TYPES = {
  Logger: Symbol.for("core.Logger"),
  RequestContextStore: Symbol.for("core.RequestContextStore"),
  ErrorMapper: Symbol.for("core.ErrorMapper"),
} as const;