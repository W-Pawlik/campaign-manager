import type { Query } from "@core/application/cqrs/Query";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";

export interface GetChronicleEntryDetailsInput {
  campaignId: string;
  entryId: string;
  actorUserId: string;
}

export class GetChronicleEntryDetailsQuery implements Query<ChronicleEntryDTO> {
  public constructor(public readonly input: GetChronicleEntryDetailsInput) {}
}
