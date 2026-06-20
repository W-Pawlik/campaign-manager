import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { UpdateNoteCommand } from "@modules/notes/application/commands/UpdateNoteCommand";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NoteRelatedEntityApplicationService } from "@modules/notes/application/services/NoteRelatedEntityApplicationService";
import type { NotePermissionDomainService } from "@modules/notes/domain/services/NotePermissionDomainService";
import { NoteCategory } from "@modules/notes/domain/value-objects/NoteCategory";
import { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";
import type { UpdateNoteParams } from "@modules/notes/domain/entities/Note";

export class UpdateNoteHandler implements CommandHandler<UpdateNoteCommand, NoteViewDTO> {
  public constructor(
    private readonly noteRepository: NoteRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: NotePermissionDomainService,
    private readonly relatedEntityService: NoteRelatedEntityApplicationService,
  ) {}

  public async execute(command: UpdateNoteCommand): Promise<NoteViewDTO> {
    const access = await this.accessService.requireMembership(
      command.input.campaignId,
      command.input.actorUserId,
    );
    const note = await this.noteRepository.findById(command.input.campaignId, command.input.noteId);

    if (note === null) {
      throw new NotFoundError("Note not found");
    }

    if (!this.permissionService.canManageNote(access.role, command.input.actorUserId, note.authorId)) {
      throw new ForbiddenError("Insufficient note permissions");
    }

    const nextVisibility =
      command.input.visibility === undefined
        ? note.visibility
        : NoteVisibility.create(command.input.visibility);

    if (!this.permissionService.canSetVisibility(access.role, nextVisibility)) {
      throw new ForbiddenError("Insufficient note visibility permissions");
    }

    const nextRelatedEntityType =
      command.input.relatedEntityType === undefined
        ? note.relatedEntityType
        : command.input.relatedEntityType === null
          ? null
          : RelatedEntityType.create(command.input.relatedEntityType);
    const nextRelatedEntityId =
      command.input.relatedEntityId === undefined ? note.relatedEntityId : command.input.relatedEntityId;

    await this.relatedEntityService.validateReferenceAndVisibility({
      campaignId: command.input.campaignId,
      actorUserId: command.input.actorUserId,
      actorRole: access.role,
      relatedEntityType: nextRelatedEntityType,
      relatedEntityId: nextRelatedEntityId,
      visibility: nextVisibility,
    });

    const updates = omitUndefinedProperties({
      title: command.input.title,
      content: command.input.content?.trim(),
      visibility: command.input.visibility === undefined ? undefined : nextVisibility,
      category:
        command.input.category === undefined
          ? undefined
          : NoteCategory.create(command.input.category),
      relatedEntityType: command.input.relatedEntityType === undefined ? undefined : nextRelatedEntityType,
      relatedEntityId: command.input.relatedEntityId,
    }) as UpdateNoteParams;
    const updatedNote = note.withUpdates(updates);

    await this.noteRepository.save(updatedNote);

    return mapNoteViewFromDomain(updatedNote);
  }
}
