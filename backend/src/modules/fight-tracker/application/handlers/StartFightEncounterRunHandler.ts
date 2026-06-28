import { randomUUID } from "node:crypto";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";
import type { StartFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/StartFightEncounterRunCommand";
import { FIGHT_ENCOUNTER_RUN_STATUS, FightEncounterRun } from "@modules/fight-tracker/domain/entities/FightEncounterRun";

export class StartFightEncounterRunHandler
  implements CommandHandler<StartFightEncounterRunCommand, FightEncounterRunDTO>
{
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: StartFightEncounterRunCommand): Promise<FightEncounterRunDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_MANAGE,
    );

    const encounter = await this.encounterRepository.findEncounterById(
      command.input.campaignId,
      command.input.encounterId,
    );

    if (encounter === null) {
      throw new NotFoundError("Fight encounter not found");
    }

    const now = new Date();
    const run = FightEncounterRun.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      encounterId: command.input.encounterId,
      status: FIGHT_ENCOUNTER_RUN_STATUS.ACTIVE,
      startedById: command.input.actorUserId,
      finishedById: null,
      roundsCompleted: 0,
      durationSeconds: null,
      outcomeLabel: null,
      summaryData: encounter.preparationData,
      startedAt: now,
      finishedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    await this.encounterRepository.createRun(run);

    return {
      id: run.id,
      encounterId: run.encounterId,
      campaignId: run.campaignId,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      finishedAt: null,
      roundsCompleted: 0,
      durationSeconds: null,
      outcomeLabel: null,
      stateData: run.summaryData,
    };
  }
}
