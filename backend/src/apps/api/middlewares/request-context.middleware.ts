import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";

export function createRequestContextMiddleware(
  requestContextStore: RequestContextStore,
): RequestHandler {
  return (req, res, next) => {
    const requestIdHeader = req.header("x-request-id");
    const correlationIdHeader = req.header("x-correlation-id");

    const requestId =
      requestIdHeader && requestIdHeader.trim().length > 0 ? requestIdHeader : uuidv4();
    const correlationId =
      correlationIdHeader && correlationIdHeader.trim().length > 0
        ? correlationIdHeader
        : requestId;

    const context = {
      requestId,
      correlationId,
      ...(req.ip ? { ip: req.ip } : {}),
      userAgent: req.header("user-agent") ?? "unknown",
    };

    requestContextStore.run(context, () => {
      res.setHeader("x-request-id", requestId);
      res.setHeader("x-correlation-id", correlationId);
      next();
    });
  };
}
