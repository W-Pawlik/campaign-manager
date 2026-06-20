import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NotePermissionDomainService } from "@modules/notes/domain/services/NotePermissionDomainService";
import type { UnpinNoteCommand } from "@modules/notes/application/commands/UnpinNoteCommand";

export class UnpinNoteHandler implements CommandHandler<UnpinNoteCommand, NoteViewDTO> {
  public constructor(
    private readonly noteRepository: NoteRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: NotePermissionDomainService,
  ) {}

  public async execute(command: UnpinNoteCommand): Promise<NoteViewDTO> {
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

    const unpinnedNote = note.unpin();
    await this.noteRepository.save(unpinnedNote);

    return mapNoteViewFromDomain(unpinnedNote);
  }
}
