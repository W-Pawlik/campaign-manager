import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { ListSessionParticipantsQuery } from "@modules/sessions/application/queries/ListSessionParticipantsQuery";
import { mapSessionParticipantDtoFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";

export class ListSessionParticipantsHandler
  implements QueryHandler<ListSessionParticipantsQuery, SessionParticipantDTO[]>
{
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly sessionReadRepository: GameSessionReadRepository,
  ) {}

  public async execute(query: ListSessionParticipantsQuery): Promise<SessionParticipantDTO[]> {
    await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const participants = await this.sessionReadRepository.listSessionParticipants(
      query.input.campaignId,
      query.input.sessionId,
    );

    return participants.map(mapSessionParticipantDtoFromDomain);
  }
}
