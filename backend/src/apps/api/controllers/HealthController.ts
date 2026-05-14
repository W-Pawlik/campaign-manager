import type { Request, Response } from "express";
import type { DatabaseHealthChecker } from "@core/application/database/DatabaseHealthChecker";

export class HealthController {
  public constructor(private readonly databaseHealthChecker: DatabaseHealthChecker) {}

  public getHealth(_req: Request, res: Response): void {
    res.status(200).json({ status: "ok" });
  }

  public async getDatabaseHealth(_req: Request, res: Response): Promise<void> {
    await this.databaseHealthChecker.checkConnection();

    res.status(200).json({
      status: "ok",
      database: "up",
    });
  }
}
