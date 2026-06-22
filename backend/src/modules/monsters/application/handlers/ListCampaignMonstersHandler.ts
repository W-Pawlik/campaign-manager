import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { MonsterListItemDTO } from "@modules/monsters/application/dto/MonsterListItemDTO";
import type { MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { ListCampaignMonstersQuery } from "@modules/monsters/application/queries/ListCampaignMonstersQuery";
import { mapMonsterListItemFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";
import type { MonsterVisibilityApplicationService } from "@modules/monsters/application/services/MonsterVisibilityApplicationService";

export class ListCampaignMonstersHandler implements QueryHandler<ListCampaignMonstersQuery, MonsterListItemDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly monsterReadRepository: MonsterReadRepository,
    private readonly visibilityService: MonsterVisibilityApplicationService,
  ) {}

  public async execute(query: ListCampaignMonstersQuery): Promise<MonsterListItemDTO[]> {
    const access = await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.MONSTER_READ,
    );
    const monsters = await this.monsterReadRepository.listCampaignMonsters({
      campaignId: query.input.campaignId,
      ...(query.input.includeGlobal === undefined ? {} : { includeGlobal: query.input.includeGlobal }),
      ...(query.input.search === undefined ? {} : { search: query.input.search }),
      ...(query.input.type === undefined ? {} : { type: query.input.type }),
      ...(query.input.minCr === undefined ? {} : { minCr: query.input.minCr }),
      ...(query.input.maxCr === undefined ? {} : { maxCr: query.input.maxCr }),
      ...(query.input.status === undefined ? {} : { status: query.input.status }),
    });

    return monsters
      .filter((monster) => this.visibilityService.canViewMonster(monster, access.role))
      .map(mapMonsterListItemFromDomain);
  }
}
