import "reflect-metadata";
import { runHealthCommand } from "@console/commands/health.command";
import { consoleAppConfig } from "@console/config/console-app.config";
import { ValidationError } from "@core/application/errors/AppError";
import type { Logger } from "@core/application/logging/Logger";
import { buildContainer } from "@core/di/container";
import { CORE_TYPES } from "@core/di/core.types";
import type { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";

async function run(): Promise<void> {
  const container = buildContainer();
  const logger = container.get<Logger>(CORE_TYPES.Logger);
  const errorMapper = container.get<ErrorMapper>(CORE_TYPES.ErrorMapper);

  const command = process.argv[2] ?? "health";

  try {
    switch (command) {
      case "health":
        await runHealthCommand(logger);
        break;
      default:
        throw new ValidationError(`Unsupported console command: ${command}`);
    }

    process.exit(0);
  } catch (error) {
    const mappedError = errorMapper.map(error);

    logger.error("Console command failed", {
      appName: consoleAppConfig.appName,
      command,
      error,
      mappedError,
    });

    process.exit(1);
  }
}

void run();
