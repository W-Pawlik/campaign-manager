import type { PrismaClient } from "@prisma/client";
import type { ShutdownHook } from "@core/application/shutdown/ShutdownHook";

export class PrismaShutdownHook implements ShutdownHook {
  public readonly name = "PrismaShutdownHook";

  public constructor(private readonly prismaClient: PrismaClient) {}

  public async shutdown(): Promise<void> {
    await this.prismaClient.$disconnect();
  }
}