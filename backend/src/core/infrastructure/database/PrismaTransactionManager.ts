import type { PrismaClient } from "@prisma/client";
import type { TransactionManager } from "@core/application/database/TransactionManager";

export class PrismaTransactionManager implements TransactionManager {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async runInTransaction<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
    return this.prismaClient.$transaction(async () => {
      return operation();
    });
  }
}
