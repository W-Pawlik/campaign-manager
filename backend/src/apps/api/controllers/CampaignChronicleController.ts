import type { Request, Response } from "express";
import { mapCreateChronicleEntryCommandInput, mapUpdateChronicleEntryCommandInput } from "@api/mappers/ChronicleCommandRequestMapper";
import { getAuthUserId, getCampaignId, getChronicleEntryId } from "@api/controllers/campaigns.controller.helpers";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateChronicleEntryCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryCommand";
import { DeleteChronicleEntryCommand } from "@modules/chronicle/application/commands/DeleteChronicleEntryCommand";
import { UpdateChronicleEntryCommand } from "@modules/chronicle/application/commands/UpdateChronicleEntryCommand";
import { GetChronicleEntryDetailsQuery } from "@modules/chronicle/application/queries/GetChronicleEntryDetailsQuery";
import { ListCampaignChronicleQuery } from "@modules/chronicle/application/queries/ListCampaignChronicleQuery";

export class CampaignChronicleController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignChronicle(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignChronicleQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createChronicleEntry(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateChronicleEntryCommand(
        mapCreateChronicleEntryCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getChronicleEntryDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetChronicleEntryDetailsQuery({
        campaignId: getCampaignId(req),
        entryId: getChronicleEntryId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateChronicleEntry(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const entryId = getChronicleEntryId(req);
    const result = await this.commandBus.execute(
      new UpdateChronicleEntryCommand(
        mapUpdateChronicleEntryCommandInput({
          campaignId,
          entryId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteChronicleEntry(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteChronicleEntryCommand({
        campaignId: getCampaignId(req),
        entryId: getChronicleEntryId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
