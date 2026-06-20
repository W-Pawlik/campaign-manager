import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { ListCampaignNpcsQuery } from "@modules/npcs/application/queries/ListCampaignNpcsQuery";
import { mapNpcViewFromDomain } from "@modules/npcs/application/services/NpcViewDtoMapper";

export class ListCampaignNpcsHandler implements QueryHandler<ListCampaignNpcsQuery, NpcViewDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly npcReadRepository: NpcReadRepository,
  ) {}

  public async execute(query: ListCampaignNpcsQuery): Promise<NpcViewDTO[]> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const npcs = await this.npcReadRepository.listCampaignNpcs(query.input.campaignId);
    const canSeeSecrets = this.visibilityService.canSeeSecretContent(access.role);

    return npcs.map((npc) => mapNpcViewFromDomain(npc, canSeeSecrets));
  }
}
