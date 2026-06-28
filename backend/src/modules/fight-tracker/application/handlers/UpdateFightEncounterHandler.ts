import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UpdateFightEncounterCommand } from "@modules/fight-tracker/application/commands/UpdateFightEncounterCommand";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";

export class UpdateFightEncounterHandler
  implements CommandHandler<UpdateFightEncounterCommand, FightEncounterDetailsDTO>
{
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly readRepository: FightTrackerReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: UpdateFightEncounterCommand): Promise<FightEncounterDetailsDTO> {
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

    const updatedEncounter = encounter.updatePreparation({
      name: command.input.name,
      environmentName: command.input.environmentName,
      environmentDetails: command.input.environmentDetails,
      combatantCount: command.input.combatantCount,
      conditionCount: command.input.conditionCount,
      preparationData: command.input.preparationData ?? null,
      updatedAt: new Date(),
    });

    await this.encounterRepository.saveEncounter(updatedEncounter);

    const details = await this.readRepository.getEncounterDetails(
      command.input.campaignId,
      command.input.encounterId,
    );

    if (details === null) {
      throw new Error("Updated fight encounter could not be reloaded");
    }

    return details;
  }
}
