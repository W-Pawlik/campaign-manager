import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CopyMonsterToCampaignCommand } from "@modules/monsters/application/commands/CopyMonsterToCampaignCommand";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import { mapMonsterDetailsFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";
import { buildMonsterSlugBaseFromName } from "@modules/monsters/application/services/MonsterSlugService";
import { findUniqueMonsterSlug } from "@modules/monsters/application/services/UniqueMonsterSlugFinder";

export class CopyMonsterToCampaignHandler implements CommandHandler<CopyMonsterToCampaignCommand, MonsterDetailsDTO> {
  public constructor(
    private readonly monsterRepository: MonsterRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: CopyMonsterToCampaignCommand): Promise<MonsterDetailsDTO> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_CREATE,
    );
    const sourceMonster = await this.monsterRepository.findById(command.input.sourceMonsterId);

    if (sourceMonster === null) {
      throw new NotFoundError("Source monster not found");
    }

    if (!sourceMonster.isGlobal()) {
      throw new ForbiddenError("Only global monsters can be copied to campaign");
    }

    const name = command.input.nameOverride?.trim() ?? sourceMonster.name;
    const baseSlug = buildMonsterSlugBaseFromName(name);
    const slug = await findUniqueMonsterSlug(this.monsterRepository, command.input.campaignId, baseSlug);
    const copiedMonster = sourceMonster.copyToCampaign({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      slug,
      name,
      actorUserId: command.input.actorUserId,
      copiedAt: new Date(),
    });

    await this.monsterRepository.create(copiedMonster);

    return mapMonsterDetailsFromDomain(copiedMonster);
  }
}
