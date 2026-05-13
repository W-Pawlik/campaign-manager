import type { ErrorRequestHandler } from "express";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { Logger } from "@core/application/logging/Logger";
import type { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";

export function createErrorHandlerMiddleware(
  errorMapper: ErrorMapper,
  logger: Logger,
  requestContextStore: RequestContextStore,
): ErrorRequestHandler {
  return (error, _req, res, next) => {
    void next;
    const requestId = requestContextStore.get()?.requestId;
    const mappedError = errorMapper.map(error, requestId);

    if (mappedError.status >= 500) {
      logger.error("Unhandled error", {
        error,
        status: mappedError.status,
      });
    } else {
      logger.warn("Handled application error", {
        error,
        status: mappedError.status,
      });
    }

    res.status(mappedError.status).json(mappedError.body);
  };
}
