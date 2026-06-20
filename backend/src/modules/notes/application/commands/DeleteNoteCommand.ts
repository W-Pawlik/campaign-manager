import type { Command } from "@core/application/cqrs/Command";

export interface DeleteNoteInput {
  campaignId: string;
  noteId: string;
  actorUserId: string;
}

export class DeleteNoteCommand implements Command<void> {
  public constructor(public readonly input: DeleteNoteInput) {}
}
