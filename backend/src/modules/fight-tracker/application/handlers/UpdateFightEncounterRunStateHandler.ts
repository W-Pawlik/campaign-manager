import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UpdateFightEncounterRunStateCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterRunStateCommand";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";

export class UpdateFightEncounterRunStateHandler
  implements CommandHandler<UpdateFightEncounterRunStateCommand, FightEncounterRunDTO>
{
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UpdateFightEncounterRunStateCommand): Promise<FightEncounterRunDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_MANAGE,
    );

    const run = await this.encounterRepository.findRunById(command.input.campaignId, command.input.runId);

    if (run === null) {
      throw new NotFoundError("Fight encounter run not found");
    }

    const updatedRun = run.updateState({
      roundsCompleted: command.input.roundsCompleted,
      durationSeconds: command.input.durationSeconds,
      stateData: command.input.stateData ?? null,
      updatedAt: new Date(),
    });

    await this.encounterRepository.saveRun(updatedRun);

    return {
      id: updatedRun.id,
      encounterId: updatedRun.encounterId,
      campaignId: updatedRun.campaignId,
      status: updatedRun.status,
      startedAt: updatedRun.startedAt.toISOString(),
      finishedAt: updatedRun.finishedAt?.toISOString() ?? null,
      roundsCompleted: updatedRun.roundsCompleted,
      durationSeconds: updatedRun.durationSeconds,
      outcomeLabel: updatedRun.outcomeLabel,
      stateData: updatedRun.summaryData,
    };
  }
}
