import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { ArchiveCharacterCommand } from "@modules/characters/application/commands/ArchiveCharacterCommand";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { CharacterPermissionDomainService } from "@modules/characters/domain/services/CharacterPermissionDomainService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class ArchiveCharacterHandler implements CommandHandler<ArchiveCharacterCommand, void> {
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: CharacterPermissionDomainService,
  ) {}

  public async execute(command: ArchiveCharacterCommand): Promise<void> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHARACTER_UPDATE,
    );
    const character = await this.characterRepository.findById(
      command.input.campaignId,
      command.input.characterId,
    );

    if (character === null) {
      throw new NotFoundError("Character not found");
    }

    if (!this.permissionService.canManageCharacter(access.role, command.input.actorUserId, character)) {
      throw new ForbiddenError("You can only archive your own character");
    }

    await this.characterRepository.save(character.archive(new Date()));
  }
}
