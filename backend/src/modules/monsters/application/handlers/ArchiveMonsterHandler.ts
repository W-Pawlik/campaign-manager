import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { ArchiveMonsterCommand } from "@modules/monsters/application/commands/ArchiveMonsterCommand";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";

export class ArchiveMonsterHandler implements CommandHandler<ArchiveMonsterCommand, void> {
  public constructor(
    private readonly monsterRepository: MonsterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: ArchiveMonsterCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_UPDATE,
    );
    const monster = await this.monsterRepository.findById(command.input.monsterId);

    if (monster === null || monster.campaignId !== command.input.campaignId) {
      throw new NotFoundError("Monster not found");
    }

    if (monster.isGlobal()) {
      throw new ForbiddenError("Global monsters cannot be archived directly");
    }

    await this.monsterRepository.save(monster.archive(new Date()));
  }
}
