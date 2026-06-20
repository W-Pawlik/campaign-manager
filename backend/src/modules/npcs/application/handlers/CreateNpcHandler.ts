import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateNpcCommand } from "@modules/npcs/application/commands/CreateNpcCommand";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { mapNpcViewFromDomain } from "@modules/npcs/application/services/NpcViewDtoMapper";
import { Npc } from "@modules/npcs/domain/entities/Npc";
import { NpcAttitude } from "@modules/npcs/domain/value-objects/NpcAttitude";
import { NpcImportance } from "@modules/npcs/domain/value-objects/NpcImportance";
import { NpcStatus } from "@modules/npcs/domain/value-objects/NpcStatus";

export class CreateNpcHandler implements CommandHandler<CreateNpcCommand, NpcViewDTO> {
  public constructor(
    private readonly npcRepository: NpcRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: CreateNpcCommand): Promise<NpcViewDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.NPC_CREATE,
    );
    const createdAt = new Date();
    const npc = Npc.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      name: command.input.name.trim(),
      title: command.input.title ?? null,
      avatarUrl: command.input.avatarUrl ?? null,
      race: command.input.race ?? null,
      occupation: command.input.occupation ?? null,
      faction: command.input.faction ?? null,
      locationId: command.input.locationId ?? null,
      attitude:
        command.input.attitude === undefined
          ? NpcAttitude.unknown()
          : NpcAttitude.create(command.input.attitude),
      importance:
        command.input.importance === undefined
          ? NpcImportance.minor()
          : NpcImportance.create(command.input.importance),
      status:
        command.input.status === undefined
          ? NpcStatus.alive()
          : NpcStatus.create(command.input.status),
      publicDescription: command.input.publicDescription ?? null,
      gmNotes: command.input.gmNotes ?? null,
      appearance: command.input.appearance ?? null,
      personality: command.input.personality ?? null,
      motivations: command.input.motivations ?? null,
      secrets: command.input.secrets ?? null,
      statBlock: command.input.statBlock ?? null,
      externalReferenceId: command.input.externalReferenceId ?? null,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.npcRepository.create(npc);

    return mapNpcViewFromDomain(npc, this.visibilityService.canSeeSecretContent(access.role));
  }
}
