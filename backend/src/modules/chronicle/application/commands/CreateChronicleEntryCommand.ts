import type { Command } from "@core/application/cqrs/Command";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";

export interface CreateChronicleEntryInput {
  campaignId: string;
  actorUserId: string;
  sessionId?: string | null;
  title: string;
  content: string;
  inWorldDate?: string | null;
  occurredAt?: Date | null;
  visibility?: string;
}

export class CreateChronicleEntryCommand implements Command<ChronicleEntryDTO> {
  public constructor(public readonly input: CreateChronicleEntryInput) {}
}
