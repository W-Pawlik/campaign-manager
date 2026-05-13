export const API_TYPES = {
  HealthController: Symbol.for("api.HealthController"),
  RequestContextMiddleware: Symbol.for("api.RequestContextMiddleware"),
  RequestLoggerMiddleware: Symbol.for("api.RequestLoggerMiddleware"),
  ErrorHandlerMiddleware: Symbol.for("api.ErrorHandlerMiddleware"),
} as const;
