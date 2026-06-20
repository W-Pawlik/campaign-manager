import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ListCampaignNotesQuery } from "@modules/notes/application/queries/ListCampaignNotesQuery";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NoteVisibilityApplicationService } from "@modules/notes/application/services/NoteVisibilityApplicationService";

export class ListCampaignNotesHandler implements QueryHandler<ListCampaignNotesQuery, NoteViewDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly noteReadRepository: NoteReadRepository,
    private readonly visibilityService: NoteVisibilityApplicationService,
  ) {}

  public async execute(query: ListCampaignNotesQuery): Promise<NoteViewDTO[]> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const notes = await this.noteReadRepository.listCampaignNotes(query.input.campaignId);
    const visibleNotes: NoteViewDTO[] = [];

    for (const note of notes) {
      if (await this.visibilityService.canViewNote(note, access.role, query.input.actorUserId)) {
        visibleNotes.push(mapNoteViewFromDomain(note));
      }
    }

    return visibleNotes;
  }
}
