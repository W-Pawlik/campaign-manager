import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { DeleteNoteCommand } from "@modules/notes/application/commands/DeleteNoteCommand";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import type { NotePermissionDomainService } from "@modules/notes/domain/services/NotePermissionDomainService";

export class DeleteNoteHandler implements CommandHandler<DeleteNoteCommand, void> {
  public constructor(
    private readonly noteRepository: NoteRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: NotePermissionDomainService,
  ) {}

  public async execute(command: DeleteNoteCommand): Promise<void> {
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

    await this.noteRepository.save(note.softDelete(new Date()));
  }
}
