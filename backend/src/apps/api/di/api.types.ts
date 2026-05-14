export const API_TYPES = {
  HealthController: Symbol.for("api.HealthController"),
  AuthController: Symbol.for("api.AuthController"),
  AuthMiddleware: Symbol.for("api.AuthMiddleware"),
  RequestContextMiddleware: Symbol.for("api.RequestContextMiddleware"),
  RequestLoggerMiddleware: Symbol.for("api.RequestLoggerMiddleware"),
  ErrorHandlerMiddleware: Symbol.for("api.ErrorHandlerMiddleware"),
} as const;
