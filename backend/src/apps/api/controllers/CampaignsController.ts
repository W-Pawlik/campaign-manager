import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import { ListUserCampaignsQuery } from "@modules/campaigns/application/queries/ListUserCampaignsQuery";
import { getAuthUserId, getCampaignId } from "@api/controllers/campaigns.controller.helpers";

export class CampaignsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listUserCampaigns(_req: Request, res: Response): Promise<void> {
    const userId = getAuthUserId(res);
    const result = await this.queryBus.execute(new ListUserCampaignsQuery({ userId }));

    res.status(200).json(result);
  }

  public async createCampaign(req: Request, res: Response): Promise<void> {
    const ownerUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCampaignCommand({
        ownerUserId,
        name: req.body.name,
        description: req.body.description,
        gameSystemId: req.body.gameSystemId,
        visibility: req.body.visibility,
        defaultLanguage: req.body.defaultLanguage,
        currentDateInWorld: req.body.currentDateInWorld,
        worldName: req.body.worldName,
        startingLevel: req.body.startingLevel,
      }),
    );

    res.status(201).json(result);
  }

  public async getCampaignDetails(req: Request, res: Response): Promise<void> {
    const userId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetCampaignDetailsQuery({
        campaignId: getCampaignId(req),
        userId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateCampaignCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        name: req.body.name,
        description: req.body.description,
        gameSystemId: req.body.gameSystemId,
        visibility: req.body.visibility,
        defaultLanguage: req.body.defaultLanguage,
        currentDateInWorld: req.body.currentDateInWorld,
        worldName: req.body.worldName,
        startingLevel: req.body.startingLevel,
      }),
    );

    res.status(200).json(result);
  }

  public async createCampaignCoverImageUpload(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCampaignCoverImageUploadCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        fileName: req.body.fileName,
        contentType: req.body.contentType,
      }),
    );

    res.status(201).json(result);
  }

  public async archiveCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveCampaignCommand({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async restoreCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new RestoreCampaignCommand({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async deleteCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteCampaignCommand({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
