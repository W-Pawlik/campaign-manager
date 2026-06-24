import type { Request, Response } from "express";
import { getAuthUserId, getMonsterId } from "@api/controllers/campaigns.controller.helpers";
import { getExternalResourceKey } from "@api/controllers/external.controller.helpers";
import {
  mapCopyOpen5eCreatureToCampaignCommandInput,
  mapCopyPublishedMonsterToCampaignCommandInput,
  mapCreatePublishedMonsterCommandInput,
} from "@api/mappers/MonsterCatalogCommandRequestMapper";
import {
  mapListOpen5eCreatureCatalogQueryInput,
  mapListPublishedMonstersQueryInput,
} from "@api/mappers/MonsterCatalogQueryRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { ListOpen5eCreatureCatalogQuery } from "@modules/external-references/application/queries/ListOpen5eCreatureCatalogQuery";
import { CopyPublishedMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyPublishedMonsterToCampaignCommand";
import { CreatePublishedMonsterCommand } from "@modules/monsters/application/commands/CreatePublishedMonsterCommand";
import { ImportOpen5eCreatureAsMonsterCommand } from "@modules/monsters/application/commands/ImportOpen5eCreatureAsMonsterCommand";
import { GetPublishedMonsterDetailsQuery } from "@modules/monsters/application/queries/GetPublishedMonsterDetailsQuery";
import { ListPublishedMonstersQuery } from "@modules/monsters/application/queries/ListPublishedMonstersQuery";

export class MonsterCatalogController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listOpen5eCreatures(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListOpen5eCreatureCatalogQuery(
        mapListOpen5eCreatureCatalogQueryInput({
          actorUserId,
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async getOpen5eCreatureDetails(req: Request, res: Response): Promise<void> {
    void getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetExternalResourceDetailsQuery({
        provider: "OPEN5E",
        resourceType: "CREATURE",
        key: getExternalResourceKey(req),
      }),
    );

    res.status(200).json(result);
  }

  public async copyOpen5eCreatureToCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new ImportOpen5eCreatureAsMonsterCommand(
        mapCopyOpen5eCreatureToCampaignCommandInput({
          actorUserId,
          resourceKey: getExternalResourceKey(req),
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async listPublishedMonsters(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListPublishedMonstersQuery(
        mapListPublishedMonstersQueryInput({
          actorUserId,
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async createPublishedMonster(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreatePublishedMonsterCommand(
        mapCreatePublishedMonsterCommandInput({
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getPublishedMonsterDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetPublishedMonsterDetailsQuery({
        actorUserId,
        monsterId: getMonsterId(req),
      }),
    );

    res.status(200).json(result);
  }

  public async copyPublishedMonsterToCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CopyPublishedMonsterToCampaignCommand(
        mapCopyPublishedMonsterToCampaignCommandInput({
          actorUserId,
          sourceMonsterId: getMonsterId(req),
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }
}
