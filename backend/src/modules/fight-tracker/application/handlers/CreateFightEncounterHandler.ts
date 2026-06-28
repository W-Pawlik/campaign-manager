import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CreateFightEncounterCommand } from "@modules/fight-tracker/application/commands/CreateFightEncounterCommand";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";
import { FightEncounter } from "@modules/fight-tracker/domain/entities/FightEncounter";

export class CreateFightEncounterHandler
  implements CommandHandler<CreateFightEncounterCommand, FightEncounterDetailsDTO>
{
  public constructor(
    private readonly encounterRepository: FightEncounterRepository,
    private readonly readRepository: FightTrackerReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: CreateFightEncounterCommand): Promise<FightEncounterDetailsDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.FIGHT_TRACKER_MANAGE,
    );

    const now = new Date();
    const encounter = FightEncounter.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      name: command.input.name.trim(),
      environmentName: command.input.environmentName.trim(),
      environmentDetails: command.input.environmentDetails.trim(),
      combatantCount: command.input.combatantCount ?? 0,
      conditionCount: command.input.conditionCount ?? 0,
      preparationData: command.input.preparationData ?? null,
      createdById: command.input.actorUserId,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    });

    await this.encounterRepository.createEncounter(encounter);

    const details = await this.readRepository.getEncounterDetails(command.input.campaignId, encounter.id);

    if (details === null) {
      throw new Error("Created fight encounter could not be reloaded");
    }

    return details;
  }
}
