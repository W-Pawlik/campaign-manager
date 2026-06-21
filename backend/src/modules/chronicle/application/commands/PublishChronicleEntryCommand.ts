import type { Command } from "@core/application/cqrs/Command";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";

export interface PublishChronicleEntryInput {
  campaignId: string;
  entryId: string;
  actorUserId: string;
}

export class PublishChronicleEntryCommand implements Command<ChronicleEntryDTO> {
  public constructor(public readonly input: PublishChronicleEntryInput) {}
}
