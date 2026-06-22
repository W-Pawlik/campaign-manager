import type { Request, Response } from "express";
import {
  getAuthUserId,
  getCampaignId,
  getMonsterId,
} from "@api/controllers/campaigns.controller.helpers";
import {
  mapCreateMonsterCommandInput,
  mapUpdateMonsterCommandInput,
} from "@api/mappers/MonsterCommandRequestMapper";
import { mapListCampaignMonstersQueryInput } from "@api/mappers/MonsterQueryRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ArchiveMonsterCommand } from "@modules/monsters/application/commands/ArchiveMonsterCommand";
import { CreateCustomMonsterCommand } from "@modules/monsters/application/commands/CreateCustomMonsterCommand";
import { UpdateMonsterCommand } from "@modules/monsters/application/commands/UpdateMonsterCommand";
import { GetMonsterDetailsQuery } from "@modules/monsters/application/queries/GetMonsterDetailsQuery";
import { ListCampaignMonstersQuery } from "@modules/monsters/application/queries/ListCampaignMonstersQuery";

export class CampaignMonstersController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignMonsters(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.queryBus.execute(
      new ListCampaignMonstersQuery(
        mapListCampaignMonstersQueryInput({
          campaignId,
          actorUserId,
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async createMonster(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateCustomMonsterCommand(
        mapCreateMonsterCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getMonsterDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetMonsterDetailsQuery({
        campaignId: getCampaignId(req),
        monsterId: getMonsterId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateMonster(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const monsterId = getMonsterId(req);
    const result = await this.commandBus.execute(
      new UpdateMonsterCommand(
        mapUpdateMonsterCommandInput({
          campaignId,
          monsterId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async archiveMonster(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveMonsterCommand({
        campaignId: getCampaignId(req),
        monsterId: getMonsterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
