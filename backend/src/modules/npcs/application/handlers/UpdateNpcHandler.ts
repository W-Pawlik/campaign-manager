import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { mapNpcViewFromDomain } from "@modules/npcs/application/services/NpcViewDtoMapper";
import type { UpdateNpcCommand } from "@modules/npcs/application/commands/UpdateNpcCommand";
import type { UpdateNpcParams } from "@modules/npcs/domain/entities/Npc";
import { NpcAttitude } from "@modules/npcs/domain/value-objects/NpcAttitude";
import { NpcImportance } from "@modules/npcs/domain/value-objects/NpcImportance";
import { NpcStatus } from "@modules/npcs/domain/value-objects/NpcStatus";

export class UpdateNpcHandler implements CommandHandler<UpdateNpcCommand, NpcViewDTO> {
  public constructor(
    private readonly npcRepository: NpcRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: UpdateNpcCommand): Promise<NpcViewDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.NPC_UPDATE,
    );
    const npc = await this.npcRepository.findById(command.input.campaignId, command.input.npcId);

    if (npc === null) {
      throw new NotFoundError("NPC not found");
    }

    const updates = omitUndefinedProperties({
      name: command.input.name?.trim(),
      title: command.input.title,
      avatarUrl: command.input.avatarUrl,
      race: command.input.race,
      occupation: command.input.occupation,
      faction: command.input.faction,
      locationId: command.input.locationId,
      attitude:
        command.input.attitude === undefined
          ? undefined
          : NpcAttitude.create(command.input.attitude),
      importance:
        command.input.importance === undefined
          ? undefined
          : NpcImportance.create(command.input.importance),
      status:
        command.input.status === undefined
          ? undefined
          : NpcStatus.create(command.input.status),
      publicDescription: command.input.publicDescription,
      gmNotes: command.input.gmNotes,
      appearance: command.input.appearance,
      personality: command.input.personality,
      motivations: command.input.motivations,
      secrets: command.input.secrets,
      statBlock: command.input.statBlock,
      externalReferenceId: command.input.externalReferenceId,
    }) as UpdateNpcParams;
    const updatedNpc = npc.withUpdates(updates);

    await this.npcRepository.save(updatedNpc);

    return mapNpcViewFromDomain(
      updatedNpc,
      this.visibilityService.canSeeSecretContent(access.role),
    );
  }
}
