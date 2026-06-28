import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";
import type { FinishFightEncounterRunCommand } from "@modules/fight-tracker/application/commands/FinishFightEncounterRunCommand";

export class FinishFightEncounterRunHandler
  implements CommandHandler<FinishFightEncounterRunCommand, FightEncounterRunDTO>
{
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: FinishFightEncounterRunCommand): Promise<FightEncounterRunDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_MANAGE,
    );

    const run = await this.encounterRepository.findRunById(
      command.input.campaignId,
      command.input.runId,
    );

    if (run === null) {
      throw new NotFoundError("Fight encounter run not found");
    }

    const finishedRun = run.finish({
      finishedById: command.input.actorUserId,
      roundsCompleted: command.input.roundsCompleted,
      durationSeconds: command.input.durationSeconds,
      outcomeLabel: command.input.outcomeLabel,
      summaryData: command.input.summaryData ?? null,
      finishedAt: new Date(),
    });

    await this.encounterRepository.saveRun(finishedRun);

    return {
      id: finishedRun.id,
      encounterId: finishedRun.encounterId,
      campaignId: finishedRun.campaignId,
      status: finishedRun.status,
      startedAt: finishedRun.startedAt.toISOString(),
      finishedAt: finishedRun.finishedAt?.toISOString() ?? null,
      roundsCompleted: finishedRun.roundsCompleted,
      durationSeconds: finishedRun.durationSeconds,
      outcomeLabel: finishedRun.outcomeLabel,
      stateData: finishedRun.summaryData,
    };
  }
}
