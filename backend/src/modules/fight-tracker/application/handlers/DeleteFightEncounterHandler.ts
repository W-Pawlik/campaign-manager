import { ConflictError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { FIGHT_ENCOUNTER_RUN_STATUS } from "@modules/fight-tracker/domain/entities/FightEncounterRun";
import type { DeleteFightEncounterCommand } from "@modules/fight-tracker/application/commands/DeleteFightEncounterCommand";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";

export class DeleteFightEncounterHandler implements CommandHandler<DeleteFightEncounterCommand, void> {
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: DeleteFightEncounterCommand): Promise<void> {
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

    const activeRun = await this.encounterRepository.findActiveRunByEncounterId(
      command.input.campaignId,
      command.input.encounterId,
    );

    if (activeRun !== null && activeRun.status === FIGHT_ENCOUNTER_RUN_STATUS.ACTIVE) {
      throw new ConflictError("Finish the active fight before deleting this encounter");
    }

    await this.encounterRepository.archiveEncounter(encounter.archive(new Date()));
  }
}
