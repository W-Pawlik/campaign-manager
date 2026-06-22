import { ExternalServiceError, NotFoundError } from "@core/application/errors/AppError";

export class Open5eUnavailableError extends ExternalServiceError {
  public constructor(cause?: unknown) {
    super("OPEN5E_UNAVAILABLE", cause);
  }
}

export class Open5eTimeoutError extends ExternalServiceError {
  public constructor(cause?: unknown) {
    super("OPEN5E_TIMEOUT", cause);
  }
}

export class Open5eResourceNotFoundError extends NotFoundError {
  public constructor(cause?: unknown) {
    super("OPEN5E_RESOURCE_NOT_FOUND", cause);
  }
}

export class Open5eRateLimitedError extends ExternalServiceError {
  public constructor(cause?: unknown) {
    super("OPEN5E_RATE_LIMITED", cause);
  }
}

export class Open5eInvalidResponseError extends ExternalServiceError {
  public constructor(cause?: unknown) {
    super("OPEN5E_INVALID_RESPONSE", cause);
  }
}

export class Open5eUnsupportedResourceTypeError extends ExternalServiceError {
  public constructor(cause?: unknown) {
    super("OPEN5E_UNSUPPORTED_RESOURCE_TYPE", cause);
  }
}
