import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ListCampaignSessionsQuery } from "@modules/sessions/application/queries/ListCampaignSessionsQuery";
import type { SessionListItemDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import { mapSessionListItemFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";

export class ListCampaignSessionsHandler
  implements QueryHandler<ListCampaignSessionsQuery, SessionListItemDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly sessionReadRepository: GameSessionReadRepository,
  ) {}

  public async execute(query: ListCampaignSessionsQuery): Promise<SessionListItemDTO[]> {
    await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const sessions = await this.sessionReadRepository.listCampaignSessions(query.input.campaignId);

    return sessions.map(mapSessionListItemFromDomain);
  }
}
