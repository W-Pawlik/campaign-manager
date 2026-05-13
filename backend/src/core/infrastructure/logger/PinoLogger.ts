import pino, { type LevelWithSilent } from "pino";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { LogMeta, Logger } from "@core/application/logging/Logger";

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  public constructor(
    private readonly requestContextStore: RequestContextStore,
    level: LevelWithSilent,
  ) {
    this.logger = pino({
      level,
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  public debug(message: string, meta?: LogMeta): void {
    this.logger.debug(this.withContext(meta), message);
  }

  public info(message: string, meta?: LogMeta): void {
    this.logger.info(this.withContext(meta), message);
  }

  public warn(message: string, meta?: LogMeta): void {
    this.logger.warn(this.withContext(meta), message);
  }

  public error(message: string, meta?: LogMeta): void {
    this.logger.error(this.withContext(meta), message);
  }

  private withContext(meta?: LogMeta): LogMeta {
    const context = this.requestContextStore.get();

    return {
      ...(context ?? {}),
      ...(meta ?? {}),
    };
  }
}