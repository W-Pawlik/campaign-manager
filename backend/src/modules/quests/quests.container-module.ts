import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import { LOCATIONS_TYPES } from "@modules/locations/locations.types";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { NPCS_TYPES } from "@modules/npcs/npcs.types";
import { AddQuestObjectiveHandler } from "@modules/quests/application/handlers/AddQuestObjectiveHandler";
import { ChangeQuestStatusHandler } from "@modules/quests/application/handlers/ChangeQuestStatusHandler";
import { CreateQuestHandler } from "@modules/quests/application/handlers/CreateQuestHandler";
import { DeleteQuestHandler } from "@modules/quests/application/handlers/DeleteQuestHandler";
import { DeleteQuestObjectiveHandler } from "@modules/quests/application/handlers/DeleteQuestObjectiveHandler";
import { GetQuestDetailsHandler } from "@modules/quests/application/handlers/GetQuestDetailsHandler";
import { LinkQuestEntityHandler } from "@modules/quests/application/handlers/LinkQuestEntityHandler";
import { ListCampaignQuestsHandler } from "@modules/quests/application/handlers/ListCampaignQuestsHandler";
import { ListQuestObjectivesHandler } from "@modules/quests/application/handlers/ListQuestObjectivesHandler";
import { UnlinkQuestEntityHandler } from "@modules/quests/application/handlers/UnlinkQuestEntityHandler";
import { UpdateQuestHandler } from "@modules/quests/application/handlers/UpdateQuestHandler";
import { UpdateQuestObjectiveHandler } from "@modules/quests/application/handlers/UpdateQuestObjectiveHandler";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import { QuestRelatedEntityApplicationService } from "@modules/quests/application/services/QuestRelatedEntityApplicationService";
import { QuestVisibilityApplicationService } from "@modules/quests/application/services/QuestVisibilityApplicationService";
import { QuestMapper } from "@modules/quests/infrastructure/persistence/QuestMapper";
import { PrismaQuestReadRepository } from "@modules/quests/infrastructure/persistence/PrismaQuestReadRepository";
import { PrismaQuestRepository } from "@modules/quests/infrastructure/persistence/PrismaQuestRepository";
import { QUESTS_TYPES } from "@modules/quests/quests.types";

export function loadQuestsContainerModule(container: Container): void {
  container
    .bind<QuestMapper>(QUESTS_TYPES.QuestMapper)
    .toDynamicValue(() => new QuestMapper())
    .inSingletonScope();

  container
    .bind<QuestVisibilityApplicationService>(QUESTS_TYPES.QuestVisibilityApplicationService)
    .toDynamicValue((context) => {
      const campaignVisibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new QuestVisibilityApplicationService(campaignVisibilityService);
    })
    .inTransientScope();

  container
    .bind<QuestRelatedEntityApplicationService>(QUESTS_TYPES.QuestRelatedEntityApplicationService)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);
      const npcRepository = context.get<NpcRepository>(NPCS_TYPES.NpcRepository);
      const locationRepository = context.get<LocationRepository>(LOCATIONS_TYPES.LocationRepository);

      return new QuestRelatedEntityApplicationService(characterRepository, npcRepository, locationRepository);
    })
    .inTransientScope();

  container
    .bind<QuestRepository>(QUESTS_TYPES.QuestRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<QuestMapper>(QUESTS_TYPES.QuestMapper);

      return new PrismaQuestRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<QuestMapper>(QUESTS_TYPES.QuestMapper);

      return new PrismaQuestReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<CreateQuestHandler>(QUESTS_TYPES.CreateQuestHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const relatedEntityService = context.get<QuestRelatedEntityApplicationService>(
        QUESTS_TYPES.QuestRelatedEntityApplicationService,
      );

      return new CreateQuestHandler(questRepository, accessService, visibilityService, relatedEntityService);
    })
    .inTransientScope();

  container
    .bind<UpdateQuestHandler>(QUESTS_TYPES.UpdateQuestHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const relatedEntityService = context.get<QuestRelatedEntityApplicationService>(
        QUESTS_TYPES.QuestRelatedEntityApplicationService,
      );

      return new UpdateQuestHandler(
        questRepository,
        questReadRepository,
        accessService,
        visibilityService,
        relatedEntityService,
      );
    })
    .inTransientScope();

  container
    .bind<DeleteQuestHandler>(QUESTS_TYPES.DeleteQuestHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeleteQuestHandler(questRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ChangeQuestStatusHandler>(QUESTS_TYPES.ChangeQuestStatusHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );

      return new ChangeQuestStatusHandler(questRepository, questReadRepository, accessService, visibilityService);
    })
    .inTransientScope();

  container
    .bind<AddQuestObjectiveHandler>(QUESTS_TYPES.AddQuestObjectiveHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new AddQuestObjectiveHandler(questRepository, questReadRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<UpdateQuestObjectiveHandler>(QUESTS_TYPES.UpdateQuestObjectiveHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new UpdateQuestObjectiveHandler(questRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<DeleteQuestObjectiveHandler>(QUESTS_TYPES.DeleteQuestObjectiveHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeleteQuestObjectiveHandler(questRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<LinkQuestEntityHandler>(QUESTS_TYPES.LinkQuestEntityHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const relatedEntityService = context.get<QuestRelatedEntityApplicationService>(
        QUESTS_TYPES.QuestRelatedEntityApplicationService,
      );

      return new LinkQuestEntityHandler(questRepository, accessService, relatedEntityService);
    })
    .inTransientScope();

  container
    .bind<UnlinkQuestEntityHandler>(QUESTS_TYPES.UnlinkQuestEntityHandler)
    .toDynamicValue((context) => {
      const questRepository = context.get<QuestRepository>(QUESTS_TYPES.QuestRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new UnlinkQuestEntityHandler(questRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignQuestsHandler>(QUESTS_TYPES.ListCampaignQuestsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const visibilityService = context.get<QuestVisibilityApplicationService>(
        QUESTS_TYPES.QuestVisibilityApplicationService,
      );

      return new ListCampaignQuestsHandler(accessService, questReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<GetQuestDetailsHandler>(QUESTS_TYPES.GetQuestDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const campaignVisibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const questVisibilityService = context.get<QuestVisibilityApplicationService>(
        QUESTS_TYPES.QuestVisibilityApplicationService,
      );

      return new GetQuestDetailsHandler(
        accessService,
        campaignVisibilityService,
        questReadRepository,
        questVisibilityService,
      );
    })
    .inTransientScope();

  container
    .bind<ListQuestObjectivesHandler>(QUESTS_TYPES.ListQuestObjectivesHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const questReadRepository = context.get<QuestReadRepository>(QUESTS_TYPES.QuestReadRepository);
      const visibilityService = context.get<QuestVisibilityApplicationService>(
        QUESTS_TYPES.QuestVisibilityApplicationService,
      );

      return new ListQuestObjectivesHandler(accessService, questReadRepository, visibilityService);
    })
    .inTransientScope();
}
