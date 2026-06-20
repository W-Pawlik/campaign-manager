import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { GetCharacterDetailsQuery } from "@modules/characters/application/queries/GetCharacterDetailsQuery";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";

export class GetCharacterDetailsHandler
  implements QueryHandler<GetCharacterDetailsQuery, CharacterDetailsDTO>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly characterReadRepository: CharacterReadRepository,
  ) {}

  public async execute(query: GetCharacterDetailsQuery): Promise<CharacterDetailsDTO> {
    await this.accessService.requirePermission(
      query.input.campaignId,
      query.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHARACTER_READ,
    );
    const character = await this.characterReadRepository.getCharacterDetails(
      query.input.campaignId,
      query.input.characterId,
    );

    if (character === null) {
      throw new NotFoundError("Character not found");
    }

    return character;
  }
}
