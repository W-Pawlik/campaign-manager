import { NotFoundError } from "@core/application/errors/AppError";
import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { GetNoteDetailsQuery } from "@modules/notes/application/queries/GetNoteDetailsQuery";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NoteVisibilityApplicationService } from "@modules/notes/application/services/NoteVisibilityApplicationService";

export class GetNoteDetailsHandler implements QueryHandler<GetNoteDetailsQuery, NoteViewDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly noteReadRepository: NoteReadRepository,
    private readonly visibilityService: NoteVisibilityApplicationService,
  ) {}

  public async execute(query: GetNoteDetailsQuery): Promise<NoteViewDTO> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const note = await this.noteReadRepository.getNoteDetails(query.input.campaignId, query.input.noteId);

    if (
      note === null ||
      !(await this.visibilityService.canViewNote(note, access.role, query.input.actorUserId))
    ) {
      throw new NotFoundError("Note not found");
    }

    return mapNoteViewFromDomain(note);
  }
}
