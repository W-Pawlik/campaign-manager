import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { GetMonsterDetailsQuery } from "@modules/monsters/application/queries/GetMonsterDetailsQuery";
import { mapMonsterDetailsFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";
import type { MonsterVisibilityApplicationService } from "@modules/monsters/application/services/MonsterVisibilityApplicationService";

export class GetMonsterDetailsHandler implements QueryHandler<GetMonsterDetailsQuery, MonsterDetailsDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly monsterReadRepository: MonsterReadRepository,
    private readonly visibilityService: MonsterVisibilityApplicationService,
  ) {}

  public async execute(query: GetMonsterDetailsQuery): Promise<MonsterDetailsDTO> {
    const access = await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_READ,
    );
    const monster = await this.monsterReadRepository.getDetails(query.input.monsterId);

    if (
      monster === null ||
      (monster.campaignId !== null && monster.campaignId !== query.input.campaignId) ||
      !this.visibilityService.canViewMonster(monster, access.role)
    ) {
      throw new NotFoundError("Monster not found");
    }

    return mapMonsterDetailsFromDomain(monster);
  }
}
