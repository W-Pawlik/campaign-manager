import { Prisma, type Npc as PrismaNpc } from "@prisma/client";
import { Npc } from "@modules/npcs/domain/entities/Npc";
import { NpcAttitude } from "@modules/npcs/domain/value-objects/NpcAttitude";
import { NpcImportance } from "@modules/npcs/domain/value-objects/NpcImportance";
import { NpcStatus } from "@modules/npcs/domain/value-objects/NpcStatus";

export class NpcMapper {
  public toDomain(prismaNpc: PrismaNpc): Npc {
    return Npc.create({
      id: prismaNpc.id,
      campaignId: prismaNpc.campaignId,
      name: prismaNpc.name,
      title: prismaNpc.title,
      avatarUrl: prismaNpc.avatarUrl,
      race: prismaNpc.race,
      occupation: prismaNpc.occupation,
      faction: prismaNpc.faction,
      locationId: prismaNpc.locationId,
      attitude: NpcAttitude.create(prismaNpc.attitude),
      importance: NpcImportance.create(prismaNpc.importance),
      status: NpcStatus.create(prismaNpc.status),
      publicDescription: prismaNpc.publicDescription,
      gmNotes: prismaNpc.gmNotes,
      appearance: prismaNpc.appearance,
      personality: prismaNpc.personality,
      motivations: prismaNpc.motivations,
      secrets: prismaNpc.secrets,
      statBlock: prismaNpc.statBlock,
      externalReferenceId: prismaNpc.externalReferenceId,
      createdById: prismaNpc.createdById,
      createdAt: prismaNpc.createdAt,
      updatedAt: prismaNpc.updatedAt,
      deletedAt: prismaNpc.deletedAt,
    });
  }

  public toPersistenceCreate(npc: Npc): Prisma.NpcUncheckedCreateInput {
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
      gmNotes: npc.gmNotes,
      appearance: npc.appearance,
      personality: npc.personality,
      motivations: npc.motivations,
      secrets: npc.secrets,
      statBlock: this.toJsonValue(npc.statBlock),
      externalReferenceId: npc.externalReferenceId,
      createdById: npc.createdById,
      createdAt: npc.createdAt,
      updatedAt: npc.updatedAt,
      deletedAt: npc.deletedAt,
    };
  }

  public toPersistenceUpdate(npc: Npc): Prisma.NpcUncheckedUpdateInput {
    return this.toPersistenceCreate(npc);
  }

  private toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
