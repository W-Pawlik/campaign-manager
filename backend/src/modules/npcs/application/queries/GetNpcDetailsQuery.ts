import type { Query } from "@core/application/cqrs/Query";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";

export interface GetNpcDetailsInput {
  campaignId: string;
  npcId: string;
  actorUserId: string;
}

export class GetNpcDetailsQuery implements Query<NpcViewDTO> {
  public constructor(public readonly input: GetNpcDetailsInput) {}
}
