import type { Command } from "@core/application/cqrs/Command";

export interface DeleteChronicleEntryInput {
  campaignId: string;
  entryId: string;
  actorUserId: string;
}

export class DeleteChronicleEntryCommand implements Command<void> {
  public constructor(public readonly input: DeleteChronicleEntryInput) {}
}
