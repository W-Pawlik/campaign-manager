import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { ListCampaignCharactersQuery } from "@modules/characters/application/queries/ListCampaignCharactersQuery";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class ListCampaignCharactersHandler
  implements QueryHandler<ListCampaignCharactersQuery, CharacterListItemDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly characterReadRepository: CharacterReadRepository,
  ) {}

  public async execute(query: ListCampaignCharactersQuery): Promise<CharacterListItemDTO[]> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHARACTER_READ,
    );

    return await this.characterReadRepository.listCampaignCharacters(query.input.campaignId);
  }
}
