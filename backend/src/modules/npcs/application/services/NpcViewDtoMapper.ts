import type { NpcGmViewDTO } from "@modules/npcs/application/dto/NpcGmViewDTO";
import type { NpcPlayerViewDTO } from "@modules/npcs/application/dto/NpcPlayerViewDTO";
import type { NpcViewDTO } from "@modules/npcs/application/dto/NpcViewDTO";
import type { Npc } from "@modules/npcs/domain/entities/Npc";

export function mapNpcPlayerViewFromDomain(npc: Npc): NpcPlayerViewDTO {
  return {
    id: npc.id,
    campaignId: npc.campaignId,
    name: npc.name,
    title: npc.title,
    avatarUrl: npc.avatarUrl,
    race: npc.race,
    occupation: npc.occupation,
    faction: npc.faction,
    locationId: npc.locationId,
    attitude: npc.attitude.value,
    importance: npc.importance.value,
    status: npc.status.value,
    publicDescription: npc.publicDescription,
    appearance: npc.appearance,
    personality: npc.personality,
    statBlock: npc.statBlock,
    externalReferenceId: npc.externalReferenceId,
    createdAt: npc.createdAt.toISOString(),
    updatedAt: npc.updatedAt.toISOString(),
  };
}

export function mapNpcGmViewFromDomain(npc: Npc): NpcGmViewDTO {
  return {
    ...mapNpcPlayerViewFromDomain(npc),
    gmNotes: npc.gmNotes,
    motivations: npc.motivations,
    secrets: npc.secrets,
    createdById: npc.createdById,
  };
}

export function mapNpcViewFromDomain(npc: Npc, canSeeSecrets: boolean): NpcViewDTO {
  return canSeeSecrets ? mapNpcGmViewFromDomain(npc) : mapNpcPlayerViewFromDomain(npc);
}
