import type { Logger } from "@core/application/logging/Logger";

export async function runHealthCommand(logger: Logger): Promise<void> {
  logger.info("Console health check passed", {
    command: "health",
  });
}