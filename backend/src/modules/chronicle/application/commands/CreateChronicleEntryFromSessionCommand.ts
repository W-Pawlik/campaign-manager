import type { Command } from "@core/application/cqrs/Command";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";

export interface CreateChronicleEntryFromSessionInput {
  campaignId: string;
  sessionId: string;
  actorUserId: string;
  title?: string;
  content?: string;
  inWorldDate?: string | null;
  occurredAt?: Date | null;
  visibility?: string;
}

export class CreateChronicleEntryFromSessionCommand implements Command<ChronicleEntryDTO> {
  public constructor(public readonly input: CreateChronicleEntryFromSessionInput) {}
}
