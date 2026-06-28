import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CreateFightEncounterHandler } from "@modules/fight-tracker/application/handlers/CreateFightEncounterHandler";
import { DeleteFightEncounterHandler } from "@modules/fight-tracker/application/handlers/DeleteFightEncounterHandler";
import { FinishFightEncounterRunHandler } from "@modules/fight-tracker/application/handlers/FinishFightEncounterRunHandler";
import { GetFightEncounterDetailsHandler } from "@modules/fight-tracker/application/handlers/GetFightEncounterDetailsHandler";
import { ListFightTrackerOverviewHandler } from "@modules/fight-tracker/application/handlers/ListFightTrackerOverviewHandler";
import { StartFightEncounterRunHandler } from "@modules/fight-tracker/application/handlers/StartFightEncounterRunHandler";
import { UpdateFightEncounterHandler } from "@modules/fight-tracker/application/handlers/UpdateFightEncounterHandler";
import { UpdateFightEncounterRunStateHandler } from "@modules/fight-tracker/application/handlers/UpdateFightEncounterRunStateHandler";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";
import { FIGHT_TRACKER_TYPES } from "@modules/fight-tracker/fight-tracker.types";
import { FightEncounterMapper } from "@modules/fight-tracker/infrastructure/persistence/FightEncounterMapper";
import { PrismaFightEncounterRepository } from "@modules/fight-tracker/infrastructure/persistence/PrismaFightEncounterRepository";
import { PrismaFightTrackerReadRepository } from "@modules/fight-tracker/infrastructure/persistence/PrismaFightTrackerReadRepository";

export function loadFightTrackerContainerModule(container: Container): void {
  container
    .bind<FightEncounterMapper>(FIGHT_TRACKER_TYPES.FightEncounterMapper)
    .toDynamicValue(() => new FightEncounterMapper())
    .inSingletonScope();

  container
    .bind<FightEncounterRepository>(FIGHT_TRACKER_TYPES.FightEncounterRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<FightEncounterMapper>(FIGHT_TRACKER_TYPES.FightEncounterMapper);

      return new PrismaFightEncounterRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<FightTrackerReadRepository>(FIGHT_TRACKER_TYPES.FightTrackerReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaFightTrackerReadRepository(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<CreateFightEncounterHandler>(FIGHT_TRACKER_TYPES.CreateFightEncounterHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const readRepository = context.get<FightTrackerReadRepository>(
        FIGHT_TRACKER_TYPES.FightTrackerReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new CreateFightEncounterHandler(
        encounterRepository,
        readRepository,
        accessService,
      );
    })
    .inTransientScope();
  container
    .bind<UpdateFightEncounterHandler>(FIGHT_TRACKER_TYPES.UpdateFightEncounterHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const readRepository = context.get<FightTrackerReadRepository>(
        FIGHT_TRACKER_TYPES.FightTrackerReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new UpdateFightEncounterHandler(encounterRepository, readRepository, accessService);
    })
    .inTransientScope();
  container
    .bind<DeleteFightEncounterHandler>(FIGHT_TRACKER_TYPES.DeleteFightEncounterHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new DeleteFightEncounterHandler(encounterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<StartFightEncounterRunHandler>(FIGHT_TRACKER_TYPES.StartFightEncounterRunHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new StartFightEncounterRunHandler(encounterRepository, accessService);
    })
    .inTransientScope();
  container
    .bind<UpdateFightEncounterRunStateHandler>(FIGHT_TRACKER_TYPES.UpdateFightEncounterRunStateHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new UpdateFightEncounterRunStateHandler(encounterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<FinishFightEncounterRunHandler>(FIGHT_TRACKER_TYPES.FinishFightEncounterRunHandler)
    .toDynamicValue((context) => {
      const encounterRepository = context.get<FightEncounterRepository>(
        FIGHT_TRACKER_TYPES.FightEncounterRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new FinishFightEncounterRunHandler(encounterRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<GetFightEncounterDetailsHandler>(FIGHT_TRACKER_TYPES.GetFightEncounterDetailsHandler)
    .toDynamicValue((context) => {
      const readRepository = context.get<FightTrackerReadRepository>(
        FIGHT_TRACKER_TYPES.FightTrackerReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new GetFightEncounterDetailsHandler(readRepository, accessService);
    })
    .inTransientScope();

  container
    .bind<ListFightTrackerOverviewHandler>(FIGHT_TRACKER_TYPES.ListFightTrackerOverviewHandler)
    .toDynamicValue((context) => {
      const readRepository = context.get<FightTrackerReadRepository>(
        FIGHT_TRACKER_TYPES.FightTrackerReadRepository,
      );
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );

      return new ListFightTrackerOverviewHandler(readRepository, accessService);
    })
    .inTransientScope();
}
