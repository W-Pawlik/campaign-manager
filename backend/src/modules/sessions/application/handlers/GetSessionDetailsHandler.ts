import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GetSessionDetailsQuery } from "@modules/sessions/application/queries/GetSessionDetailsQuery";
import { mapSessionDetailsFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";

export class GetSessionDetailsHandler implements QueryHandler<GetSessionDetailsQuery, SessionDetailsDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly sessionReadRepository: GameSessionReadRepository,
  ) {}

  public async execute(query: GetSessionDetailsQuery): Promise<SessionDetailsDTO> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const details = await this.sessionReadRepository.getSessionDetails(query.input.campaignId, query.input.sessionId);

    if (details === null) {
      throw new NotFoundError("Session not found");
    }

    return mapSessionDetailsFromDomain(details.session, details.participants, access.role, this.visibilityService);
  }
}
