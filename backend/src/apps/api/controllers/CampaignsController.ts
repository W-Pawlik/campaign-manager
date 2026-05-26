import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import { ListUserCampaignsQuery } from "@modules/campaigns/application/queries/ListUserCampaignsQuery";

export class CampaignsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listUserCampaigns(_req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(new ListUserCampaignsQuery({ userId }));

    res.status(200).json(result);
  }

  public async createCampaign(req: Request, res: Response): Promise<void> {
    const ownerUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCampaignCommand({
        ownerUserId,
        name: req.body.name,
        visibility: req.body.visibility,
      }),
    );

    res.status(201).json(result);
  }

  public async getCampaignDetails(req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetCampaignDetailsQuery({
        campaignId: this.getCampaignId(req),
        userId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        name: req.body.name,
        visibility: req.body.visibility,
      }),
    );

    res.status(200).json(result);
  }

  public async archiveCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async restoreCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new RestoreCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async deleteCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  private getAuthUserId(res: Response): string {
    const userId = res.locals.authUserId as string | undefined;

    if (!userId) {
      throw new ForbiddenError("Authentication required");
    }

    return userId;
  }

  private getCampaignId(req: Request): string {
    const campaignId = req.params.campaignId;

    if (typeof campaignId !== "string" || campaignId.trim().length === 0) {
      throw new ValidationError("Campaign id is required");
    }

    return campaignId;
  }
}
