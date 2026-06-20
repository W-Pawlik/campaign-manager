import { randomUUID } from "node:crypto";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateNoteCommand } from "@modules/notes/application/commands/CreateNoteCommand";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NoteRelatedEntityApplicationService } from "@modules/notes/application/services/NoteRelatedEntityApplicationService";
import { Note } from "@modules/notes/domain/entities/Note";
import type { NotePermissionDomainService } from "@modules/notes/domain/services/NotePermissionDomainService";
import { NoteCategory } from "@modules/notes/domain/value-objects/NoteCategory";
import { NoteVisibility } from "@modules/notes/domain/value-objects/NoteVisibility";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export class CreateNoteHandler implements CommandHandler<CreateNoteCommand, NoteViewDTO> {
  public constructor(
    private readonly noteRepository: NoteRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: NotePermissionDomainService,
    private readonly relatedEntityService: NoteRelatedEntityApplicationService,
  ) {}

  public async execute(command: CreateNoteCommand): Promise<NoteViewDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.NOTE_CREATE_PLAYER,
    );
    const visibility =
      command.input.visibility === undefined
        ? NoteVisibility.campaignPublic()
        : NoteVisibility.create(command.input.visibility);

    if (!this.permissionService.canSetVisibility(access.role, visibility)) {
      throw new ForbiddenError("Insufficient note visibility permissions");
    }

    const relatedEntityType =
      command.input.relatedEntityType === undefined || command.input.relatedEntityType === null
        ? null
        : RelatedEntityType.create(command.input.relatedEntityType);
    const relatedEntityId = command.input.relatedEntityId ?? null;

    await this.relatedEntityService.validateReferenceAndVisibility({
      campaignId: command.input.campaignId,
      actorUserId: command.input.actorUserId,
      actorRole: access.role,
      relatedEntityType,
      relatedEntityId,
      visibility,
    });

    const createdAt = new Date();
    const note = Note.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      authorId: command.input.actorUserId,
      title: command.input.title ?? null,
      content: command.input.content.trim(),
      visibility,
      category:
        command.input.category === undefined
          ? NoteCategory.general()
          : NoteCategory.create(command.input.category),
      relatedEntityType,
      relatedEntityId,
      isPinned: false,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.noteRepository.create(note);

    return mapNoteViewFromDomain(note);
  }
}
