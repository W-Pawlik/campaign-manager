import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CreateNoteHandler } from "@modules/notes/application/handlers/CreateNoteHandler";
import { DeleteNoteHandler } from "@modules/notes/application/handlers/DeleteNoteHandler";
import { GetNoteDetailsHandler } from "@modules/notes/application/handlers/GetNoteDetailsHandler";
import { ListCampaignNotesHandler } from "@modules/notes/application/handlers/ListCampaignNotesHandler";
import { ListRelatedNotesHandler } from "@modules/notes/application/handlers/ListRelatedNotesHandler";
import { PinNoteHandler } from "@modules/notes/application/handlers/PinNoteHandler";
import { UnpinNoteHandler } from "@modules/notes/application/handlers/UnpinNoteHandler";
import { UpdateNoteHandler } from "@modules/notes/application/handlers/UpdateNoteHandler";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import { NoteRelatedEntityApplicationService } from "@modules/notes/application/services/NoteRelatedEntityApplicationService";
import { NoteVisibilityApplicationService } from "@modules/notes/application/services/NoteVisibilityApplicationService";
import { NotePermissionDomainService } from "@modules/notes/domain/services/NotePermissionDomainService";
import { NoteMapper } from "@modules/notes/infrastructure/persistence/NoteMapper";
import { PrismaNoteReadRepository } from "@modules/notes/infrastructure/persistence/PrismaNoteReadRepository";
import { PrismaNoteRepository } from "@modules/notes/infrastructure/persistence/PrismaNoteRepository";
import { NOTES_TYPES } from "@modules/notes/notes.types";

export function loadNotesContainerModule(container: Container): void {
  container
    .bind<NoteMapper>(NOTES_TYPES.NoteMapper)
    .toDynamicValue(() => new NoteMapper())
    .inSingletonScope();

  container
    .bind<NotePermissionDomainService>(NOTES_TYPES.NotePermissionDomainService)
    .toDynamicValue(() => new NotePermissionDomainService())
    .inSingletonScope();

  container
    .bind<NoteRepository>(NOTES_TYPES.NoteRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<NoteMapper>(NOTES_TYPES.NoteMapper);

      return new PrismaNoteRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<NoteReadRepository>(NOTES_TYPES.NoteReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<NoteMapper>(NOTES_TYPES.NoteMapper);

      return new PrismaNoteReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<NoteRelatedEntityApplicationService>(NOTES_TYPES.NoteRelatedEntityApplicationService)
    .toDynamicValue((context) => {
      const characterRepository = context.get<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository);

      return new NoteRelatedEntityApplicationService(characterRepository);
    })
    .inTransientScope();

  container
    .bind<NoteVisibilityApplicationService>(NOTES_TYPES.NoteVisibilityApplicationService)
    .toDynamicValue((context) => {
      const campaignVisibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const relatedEntityService = context.get<NoteRelatedEntityApplicationService>(
        NOTES_TYPES.NoteRelatedEntityApplicationService,
      );

      return new NoteVisibilityApplicationService(campaignVisibilityService, relatedEntityService);
    })
    .inTransientScope();

  container
    .bind<CreateNoteHandler>(NOTES_TYPES.CreateNoteHandler)
    .toDynamicValue((context) => {
      const noteRepository = context.get<NoteRepository>(NOTES_TYPES.NoteRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<NotePermissionDomainService>(
        NOTES_TYPES.NotePermissionDomainService,
      );
      const relatedEntityService = context.get<NoteRelatedEntityApplicationService>(
        NOTES_TYPES.NoteRelatedEntityApplicationService,
      );

      return new CreateNoteHandler(noteRepository, accessService, permissionService, relatedEntityService);
    })
    .inTransientScope();

  container
    .bind<UpdateNoteHandler>(NOTES_TYPES.UpdateNoteHandler)
    .toDynamicValue((context) => {
      const noteRepository = context.get<NoteRepository>(NOTES_TYPES.NoteRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<NotePermissionDomainService>(
        NOTES_TYPES.NotePermissionDomainService,
      );
      const relatedEntityService = context.get<NoteRelatedEntityApplicationService>(
        NOTES_TYPES.NoteRelatedEntityApplicationService,
      );

      return new UpdateNoteHandler(noteRepository, accessService, permissionService, relatedEntityService);
    })
    .inTransientScope();

  container
    .bind<DeleteNoteHandler>(NOTES_TYPES.DeleteNoteHandler)
    .toDynamicValue((context) => {
      const noteRepository = context.get<NoteRepository>(NOTES_TYPES.NoteRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<NotePermissionDomainService>(
        NOTES_TYPES.NotePermissionDomainService,
      );

      return new DeleteNoteHandler(noteRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<PinNoteHandler>(NOTES_TYPES.PinNoteHandler)
    .toDynamicValue((context) => {
      const noteRepository = context.get<NoteRepository>(NOTES_TYPES.NoteRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<NotePermissionDomainService>(
        NOTES_TYPES.NotePermissionDomainService,
      );

      return new PinNoteHandler(noteRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<UnpinNoteHandler>(NOTES_TYPES.UnpinNoteHandler)
    .toDynamicValue((context) => {
      const noteRepository = context.get<NoteRepository>(NOTES_TYPES.NoteRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const permissionService = context.get<NotePermissionDomainService>(
        NOTES_TYPES.NotePermissionDomainService,
      );

      return new UnpinNoteHandler(noteRepository, accessService, permissionService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignNotesHandler>(NOTES_TYPES.ListCampaignNotesHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const noteReadRepository = context.get<NoteReadRepository>(NOTES_TYPES.NoteReadRepository);
      const visibilityService = context.get<NoteVisibilityApplicationService>(
        NOTES_TYPES.NoteVisibilityApplicationService,
      );

      return new ListCampaignNotesHandler(accessService, noteReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<GetNoteDetailsHandler>(NOTES_TYPES.GetNoteDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const noteReadRepository = context.get<NoteReadRepository>(NOTES_TYPES.NoteReadRepository);
      const visibilityService = context.get<NoteVisibilityApplicationService>(
        NOTES_TYPES.NoteVisibilityApplicationService,
      );

      return new GetNoteDetailsHandler(accessService, noteReadRepository, visibilityService);
    })
    .inTransientScope();

  container
    .bind<ListRelatedNotesHandler>(NOTES_TYPES.ListRelatedNotesHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const noteReadRepository = context.get<NoteReadRepository>(NOTES_TYPES.NoteReadRepository);
      const visibilityService = context.get<NoteVisibilityApplicationService>(
        NOTES_TYPES.NoteVisibilityApplicationService,
      );

      return new ListRelatedNotesHandler(accessService, noteReadRepository, visibilityService);
    })
    .inTransientScope();
}
