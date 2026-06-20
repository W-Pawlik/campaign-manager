import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { GetNpcDetailsQuery } from "@modules/npcs/application/queries/GetNpcDetailsQuery";
import { mapNpcViewFromDomain } from "@modules/npcs/application/services/NpcViewDtoMapper";

export class GetNpcDetailsHandler implements QueryHandler<GetNpcDetailsQuery, NpcViewDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly npcReadRepository: NpcReadRepository,
  ) {}

  public async execute(query: GetNpcDetailsQuery): Promise<NpcViewDTO> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const npc = await this.npcReadRepository.getNpcDetails(query.input.campaignId, query.input.npcId);

    if (npc === null) {
      throw new NotFoundError("NPC not found");
    }

    return mapNpcViewFromDomain(npc, this.visibilityService.canSeeSecretContent(access.role));
  }
}
