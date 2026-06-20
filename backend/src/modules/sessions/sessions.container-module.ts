import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CancelSessionHandler } from "@modules/sessions/application/handlers/CancelSessionHandler";
import { CompleteSessionHandler } from "@modules/sessions/application/handlers/CompleteSessionHandler";
import { ConfirmSessionAttendanceHandler } from "@modules/sessions/application/handlers/ConfirmSessionAttendanceHandler";
import { CreateSessionHandler } from "@modules/sessions/application/handlers/CreateSessionHandler";
import { DeclineSessionAttendanceHandler } from "@modules/sessions/application/handlers/DeclineSessionAttendanceHandler";
import { GetSessionDetailsHandler } from "@modules/sessions/application/handlers/GetSessionDetailsHandler";
import { ListCampaignSessionsHandler } from "@modules/sessions/application/handlers/ListCampaignSessionsHandler";
import { ListSessionParticipantsHandler } from "@modules/sessions/application/handlers/ListSessionParticipantsHandler";
import { UpdateSessionHandler } from "@modules/sessions/application/handlers/UpdateSessionHandler";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import { PrismaGameSessionReadRepository } from "@modules/sessions/infrastructure/persistence/PrismaGameSessionReadRepository";
import { PrismaGameSessionRepository } from "@modules/sessions/infrastructure/persistence/PrismaGameSessionRepository";
import { PrismaSessionParticipantRepository } from "@modules/sessions/infrastructure/persistence/PrismaSessionParticipantRepository";
import { SessionMapper } from "@modules/sessions/infrastructure/persistence/SessionMapper";
import { SESSIONS_TYPES } from "@modules/sessions/sessions.types";

export function loadSessionsContainerModule(container: Container): void {
  container
    .bind<SessionMapper>(SESSIONS_TYPES.SessionMapper)
    .toDynamicValue(() => new SessionMapper())
    .inSingletonScope();

  container
    .bind<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<SessionMapper>(SESSIONS_TYPES.SessionMapper);

      return new PrismaGameSessionRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<GameSessionReadRepository>(SESSIONS_TYPES.GameSessionReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<SessionMapper>(SESSIONS_TYPES.SessionMapper);

      return new PrismaGameSessionReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<SessionParticipantRepository>(SESSIONS_TYPES.SessionParticipantRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<SessionMapper>(SESSIONS_TYPES.SessionMapper);

      return new PrismaSessionParticipantRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<CreateSessionHandler>(SESSIONS_TYPES.CreateSessionHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const participantRepository = context.get<SessionParticipantRepository>(
        SESSIONS_TYPES.SessionParticipantRepository,
      );
      const membershipRepository = context.get<CampaignMembershipRepository>(
        CAMPAIGNS_TYPES.CampaignMembershipRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new CreateSessionHandler(
        sessionRepository,
        participantRepository,
        membershipRepository,
        accessService,
        visibilityService,
      );
    })
    .inTransientScope();

  container
    .bind<UpdateSessionHandler>(SESSIONS_TYPES.UpdateSessionHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const sessionReadRepository = context.get<GameSessionReadRepository>(
        SESSIONS_TYPES.GameSessionReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new UpdateSessionHandler(sessionRepository, sessionReadRepository, accessService, visibilityService);
    })
    .inTransientScope();

  container
    .bind<CancelSessionHandler>(SESSIONS_TYPES.CancelSessionHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new CancelSessionHandler(sessionRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ConfirmSessionAttendanceHandler>(SESSIONS_TYPES.ConfirmSessionAttendanceHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const participantRepository = context.get<SessionParticipantRepository>(
        SESSIONS_TYPES.SessionParticipantRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new ConfirmSessionAttendanceHandler(sessionRepository, participantRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<DeclineSessionAttendanceHandler>(SESSIONS_TYPES.DeclineSessionAttendanceHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const participantRepository = context.get<SessionParticipantRepository>(
        SESSIONS_TYPES.SessionParticipantRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeclineSessionAttendanceHandler(sessionRepository, participantRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<CompleteSessionHandler>(SESSIONS_TYPES.CompleteSessionHandler)
    .toDynamicValue((context) => {
      const sessionRepository = context.get<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository);
      const sessionReadRepository = context.get<GameSessionReadRepository>(
        SESSIONS_TYPES.GameSessionReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new CompleteSessionHandler(sessionRepository, sessionReadRepository, accessService, visibilityService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignSessionsHandler>(SESSIONS_TYPES.ListCampaignSessionsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const sessionReadRepository = context.get<GameSessionReadRepository>(
        SESSIONS_TYPES.GameSessionReadRepository,
      );

      return new ListCampaignSessionsHandler(accessService, sessionReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetSessionDetailsHandler>(SESSIONS_TYPES.GetSessionDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const sessionReadRepository = context.get<GameSessionReadRepository>(
        SESSIONS_TYPES.GameSessionReadRepository,
      );

      return new GetSessionDetailsHandler(accessService, visibilityService, sessionReadRepository);
    })
    .inTransientScope();

  container
    .bind<ListSessionParticipantsHandler>(SESSIONS_TYPES.ListSessionParticipantsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const sessionReadRepository = context.get<GameSessionReadRepository>(
        SESSIONS_TYPES.GameSessionReadRepository,
      );

      return new ListSessionParticipantsHandler(accessService, sessionReadRepository);
    })
    .inTransientScope();
}
