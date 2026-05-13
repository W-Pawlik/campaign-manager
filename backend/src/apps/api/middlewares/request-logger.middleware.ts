import type { RequestHandler } from "express";
import type { Logger } from "@core/application/logging/Logger";

export function createRequestLoggerMiddleware(logger: Logger): RequestHandler {
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

      logger.info("HTTP request completed", {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      });
    });

    next();
  };
}