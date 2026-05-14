import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type { DatabaseHealthChecker } from "@core/application/database/DatabaseHealthChecker";

export class PrismaDatabaseHealthChecker implements DatabaseHealthChecker {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async checkConnection(): Promise<void> {
    await this.prismaClient.$queryRaw(Prisma.sql`SELECT 1`);
  }
}