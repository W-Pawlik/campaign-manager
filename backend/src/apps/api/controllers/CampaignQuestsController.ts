import type { Request, Response } from "express";
import {
  getAuthUserId,
  getCampaignId,
  getObjectiveId,
  getQuestId,
} from "@api/controllers/campaigns.controller.helpers";
import {
  mapAddQuestObjectiveCommandInput,
  mapCreateQuestCommandInput,
  mapUpdateQuestCommandInput,
  mapUpdateQuestObjectiveCommandInput,
} from "@api/mappers/QuestCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { AddQuestObjectiveCommand } from "@modules/quests/application/commands/AddQuestObjectiveCommand";
import { CreateQuestCommand } from "@modules/quests/application/commands/CreateQuestCommand";
import { DeleteQuestCommand } from "@modules/quests/application/commands/DeleteQuestCommand";
import { DeleteQuestObjectiveCommand } from "@modules/quests/application/commands/DeleteQuestObjectiveCommand";
import { UpdateQuestCommand } from "@modules/quests/application/commands/UpdateQuestCommand";
import { UpdateQuestObjectiveCommand } from "@modules/quests/application/commands/UpdateQuestObjectiveCommand";
import { GetQuestDetailsQuery } from "@modules/quests/application/queries/GetQuestDetailsQuery";
import { ListCampaignQuestsQuery } from "@modules/quests/application/queries/ListCampaignQuestsQuery";

export class CampaignQuestsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignQuests(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignQuestsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createQuest(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateQuestCommand(
        mapCreateQuestCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getQuestDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetQuestDetailsQuery({
        campaignId: getCampaignId(req),
        questId: getQuestId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateQuest(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const questId = getQuestId(req);
    const result = await this.commandBus.execute(
      new UpdateQuestCommand(
        mapUpdateQuestCommandInput({
          campaignId,
          questId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteQuest(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteQuestCommand({
        campaignId: getCampaignId(req),
        questId: getQuestId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async addQuestObjective(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const questId = getQuestId(req);
    const result = await this.commandBus.execute(
      new AddQuestObjectiveCommand(
        mapAddQuestObjectiveCommandInput({
          campaignId,
          questId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async updateQuestObjective(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const questId = getQuestId(req);
    const objectiveId = getObjectiveId(req);
    const result = await this.commandBus.execute(
      new UpdateQuestObjectiveCommand(
        mapUpdateQuestObjectiveCommandInput({
          campaignId,
          questId,
          objectiveId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteQuestObjective(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteQuestObjectiveCommand({
        campaignId: getCampaignId(req),
        questId: getQuestId(req),
        objectiveId: getObjectiveId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
