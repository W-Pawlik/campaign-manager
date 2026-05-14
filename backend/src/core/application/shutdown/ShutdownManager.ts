import type { Logger } from "@core/application/logging/Logger";
import type { ShutdownHook } from "@core/application/shutdown/ShutdownHook";

export type ShutdownTrigger =
  | "SIGTERM"
  | "SIGINT"
  | "uncaughtException"
  | "unhandledRejection"
  | "manual";

export class ShutdownManager {
  private readonly hooks: ShutdownHook[] = [];
  private shutdownPromise?: Promise<number>;
  private handlersInstalled = false;

  public constructor(private readonly logger: Logger) {}

  public registerHook(hook: ShutdownHook): void {
    this.hooks.push(hook);
  }

  public installProcessHandlers(): void {
    if (this.handlersInstalled) {
      return;
    }

    this.handlersInstalled = true;

    process.once("SIGTERM", () => {
      void this.shutdownAndExit("SIGTERM");
    });

    process.once("SIGINT", () => {
      void this.shutdownAndExit("SIGINT");
    });

    process.once("uncaughtException", (error) => {
      void this.shutdownAndExit("uncaughtException", error);
    });

    process.once("unhandledRejection", (reason) => {
      void this.shutdownAndExit("unhandledRejection", reason);
    });
  }

  public async shutdown(trigger: ShutdownTrigger, error?: unknown): Promise<number> {
    if (this.shutdownPromise) {
      return this.shutdownPromise;
    }

    this.shutdownPromise = this.performShutdown(trigger, error);

    return this.shutdownPromise;
  }

  private async shutdownAndExit(trigger: ShutdownTrigger, error?: unknown): Promise<void> {
    const exitCode = await this.shutdown(trigger, error);
    process.exit(exitCode);
  }

  private async performShutdown(trigger: ShutdownTrigger, error?: unknown): Promise<number> {
    this.logger.info("Graceful shutdown started", {
      trigger,
      hooksCount: this.hooks.length,
    });

    if (error) {
      this.logger.error("Shutdown triggered by error", {
        trigger,
        error,
      });
    }

    let hasFailures = false;

    const hooksInReverseOrder = [...this.hooks].reverse();

    for (const hook of hooksInReverseOrder) {
      try {
        await hook.shutdown();
        this.logger.info("Shutdown hook completed", {
          hook: hook.name,
        });
      } catch (hookError) {
        hasFailures = true;
        this.logger.error("Shutdown hook failed", {
          hook: hook.name,
          error: hookError,
        });
      }
    }

    const exitCode = hasFailures || error ? 1 : 0;

    this.logger.info("Graceful shutdown finished", {
      trigger,
      exitCode,
    });

    return exitCode;
  }
}