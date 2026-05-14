import { PrismaClient } from "@prisma/client";
import { coreConfig } from "@core/config/core.config";

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasourceUrl: coreConfig.database.url,
    log:
      coreConfig.app.env === "development"
        ? [
            { level: "error", emit: "stdout" },
            { level: "warn", emit: "stdout" },
          ]
        : [{ level: "error", emit: "stdout" }],
  });
}