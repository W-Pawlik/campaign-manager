import type { PrismaClient } from "@prisma/client";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import type { Npc } from "@modules/npcs/domain/entities/Npc";
import type { NpcMapper } from "@modules/npcs/infrastructure/persistence/NpcMapper";

export class PrismaNpcRepository implements NpcRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: NpcMapper,
  ) {}

  public async findById(campaignId: string, npcId: string): Promise<Npc | null> {
    const npc = await this.prismaClient.npc.findFirst({
      where: {
        id: npcId,
        campaignId,
        deletedAt: null,
      },
    });

    return npc === null ? null : this.mapper.toDomain(npc);
  }

  public async create(npc: Npc): Promise<void> {
    await this.prismaClient.npc.create({
      data: this.mapper.toPersistenceCreate(npc),
    });
  }

  public async save(npc: Npc): Promise<void> {
    await this.prismaClient.npc.update({
      where: { id: npc.id },
      data: this.mapper.toPersistenceUpdate(npc),
    });
  }
}
