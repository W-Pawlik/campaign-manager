import type { Request, Response } from "express";
import { getAuthUserId, getCampaignId, getNpcId } from "@api/controllers/campaigns.controller.helpers";
import { mapCreateNpcCommandInput, mapUpdateNpcCommandInput } from "@api/mappers/NpcCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateNpcCommand } from "@modules/npcs/application/commands/CreateNpcCommand";
import { DeleteNpcCommand } from "@modules/npcs/application/commands/DeleteNpcCommand";
import { UpdateNpcCommand } from "@modules/npcs/application/commands/UpdateNpcCommand";
import { GetNpcDetailsQuery } from "@modules/npcs/application/queries/GetNpcDetailsQuery";
import { ListCampaignNpcsQuery } from "@modules/npcs/application/queries/ListCampaignNpcsQuery";

export class CampaignNpcsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignNpcs(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignNpcsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createNpc(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateNpcCommand(
        mapCreateNpcCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getNpcDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const npcId = getNpcId(req);
    const result = await this.queryBus.execute(
      new GetNpcDetailsQuery({
        campaignId,
        npcId,
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateNpc(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const npcId = getNpcId(req);
    const result = await this.commandBus.execute(
      new UpdateNpcCommand(
        mapUpdateNpcCommandInput({
          campaignId,
          npcId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteNpc(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteNpcCommand({
        campaignId: getCampaignId(req),
        npcId: getNpcId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
