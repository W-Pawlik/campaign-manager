import type { Request, Response } from "express";
import {
  getAuthUserId,
  getCampaignId,
  getFightEncounterId,
  getFightEncounterRunId,
} from "@api/controllers/campaigns.controller.helpers";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateFightEncounterCommand } from "@modules/fight-tracker/application/commands/CreateFightEncounterCommand";
import { DeleteFightEncounterCommand } from "@modules/fight-tracker/application/commands/DeleteFightEncounterCommand";
import { FinishFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/FinishFightEncounterRunCommand";
import { StartFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/StartFightEncounterRunCommand";
import { UpdateFightEncounterCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterCommand";
import { UpdateFightEncounterRunStateCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterRunStateCommand";
import { GetFightEncounterDetailsQuery } from "@modules/fight-tracker/application/queries/GetFightEncounterDetailsQuery";
import { ListFightTrackerOverviewQuery } from "@modules/fight-tracker/application/queries/ListFightTrackerOverviewQuery";

export class CampaignFightTrackerController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getOverview(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListFightTrackerOverviewQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createEncounter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateFightEncounterCommand({
        campaignId,
        actorUserId,
        name: req.body.name,
        environmentName: req.body.environmentName,
        environmentDetails: req.body.environmentDetails,
        combatantCount: req.body.combatantCount,
        conditionCount: req.body.conditionCount,
        preparationData: req.body.preparationData,
      }),
    );

    res.status(201).json(result);
  }

  public async getEncounterDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetFightEncounterDetailsQuery({
        campaignId: getCampaignId(req),
        encounterId: getFightEncounterId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateEncounter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateFightEncounterCommand({
        campaignId: getCampaignId(req),
        encounterId: getFightEncounterId(req),
        actorUserId,
        name: req.body.name,
        environmentName: req.body.environmentName,
        environmentDetails: req.body.environmentDetails,
        combatantCount: req.body.combatantCount,
        conditionCount: req.body.conditionCount,
        preparationData: req.body.preparationData,
      }),
    );

    res.status(200).json(result);
  }

  public async deleteEncounter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteFightEncounterCommand({
        campaignId: getCampaignId(req),
        encounterId: getFightEncounterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async startEncounterRun(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new StartFightEncounterRunCommand({
        campaignId: getCampaignId(req),
        encounterId: getFightEncounterId(req),
        actorUserId,
      }),
    );

    res.status(201).json(result);
  }

  public async finishEncounterRun(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new FinishFightEncounterRunCommand({
        campaignId: getCampaignId(req),
        runId: getFightEncounterRunId(req),
        actorUserId,
        roundsCompleted: req.body.roundsCompleted,
        durationSeconds: req.body.durationSeconds,
        outcomeLabel:
          req.body.outcomeLabel ??
          (req.body.outcomeType ? req.body.outcomeType.toLowerCase() : null),
        summaryData: req.body.summaryData,
      }),
    );

    res.status(200).json(result);
  }

  public async updateEncounterRunState(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateFightEncounterRunStateCommand({
        campaignId: getCampaignId(req),
        runId: getFightEncounterRunId(req),
        actorUserId,
        roundsCompleted: req.body.roundsCompleted,
        durationSeconds: req.body.durationSeconds,
        stateData: req.body.stateData,
      }),
    );

    res.status(200).json(result);
  }
}
