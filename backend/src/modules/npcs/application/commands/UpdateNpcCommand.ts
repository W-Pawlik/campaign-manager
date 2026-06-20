import type { Command } from "@core/application/cqrs/Command";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";

export interface UpdateNpcInput {
  campaignId: string;
  npcId: string;
  actorUserId: string;
  name?: string;
  title?: string | null;
  avatarUrl?: string | null;
  race?: string | null;
  occupation?: string | null;
  faction?: string | null;
  locationId?: string | null;
  attitude?: string;
  importance?: string;
  status?: string;
  publicDescription?: string | null;
  gmNotes?: string | null;
  appearance?: string | null;
  personality?: string | null;
  motivations?: string | null;
  secrets?: string | null;
  statBlock?: unknown | null;
  externalReferenceId?: string | null;
}

export class UpdateNpcCommand implements Command<NpcViewDTO> {
  public constructor(public readonly input: UpdateNpcInput) {}
}
