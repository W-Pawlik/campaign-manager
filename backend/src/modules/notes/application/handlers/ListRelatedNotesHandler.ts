import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ListRelatedNotesQuery } from "@modules/notes/application/queries/ListRelatedNotesQuery";
import type { NoteViewDTO } from "@modules/notes/application/dto/NoteViewDTO";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import { mapNoteViewFromDomain } from "@modules/notes/application/services/NoteDtoMapper";
import type { NoteVisibilityApplicationService } from "@modules/notes/application/services/NoteVisibilityApplicationService";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

export class ListRelatedNotesHandler implements QueryHandler<ListRelatedNotesQuery, NoteViewDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly noteReadRepository: NoteReadRepository,
    private readonly visibilityService: NoteVisibilityApplicationService,
  ) {}

  public async execute(query: ListRelatedNotesQuery): Promise<NoteViewDTO[]> {
    const access = await this.accessService.requireMembership(
      query.input.campaignId,
      query.input.actorUserId,
    );
    const relatedEntityType = RelatedEntityType.create(query.input.relatedEntityType);
    const notes = await this.noteReadRepository.listRelatedNotes(
      query.input.campaignId,
      relatedEntityType,
      query.input.relatedEntityId,
    );
    const visibleNotes: NoteViewDTO[] = [];

    for (const note of notes) {
      if (await this.visibilityService.canViewNote(note, access.role, query.input.actorUserId)) {
        visibleNotes.push(mapNoteViewFromDomain(note));
      }
    }

    return visibleNotes;
  }
}
