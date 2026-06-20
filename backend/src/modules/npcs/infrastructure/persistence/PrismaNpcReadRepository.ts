import type { PrismaClient } from "@prisma/client";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { Npc } from "@modules/npcs/domain/entities/Npc";
import type { NpcMapper } from "@modules/npcs/infrastructure/persistence/NpcMapper";

export class PrismaNpcReadRepository implements NpcReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: NpcMapper,
  ) {}

  public async listCampaignNpcs(campaignId: string): Promise<Npc[]> {
    const npcs = await this.prismaClient.npc.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      orderBy: [
        { importance: "desc" },
        { name: "asc" },
        { createdAt: "asc" },
      ],
    });

    return npcs.map((npc) => this.mapper.toDomain(npc));
  }

  public async getNpcDetails(campaignId: string, npcId: string): Promise<Npc | null> {
    const npc = await this.prismaClient.npc.findFirst({
      where: {
        id: npcId,
        campaignId,
        deletedAt: null,
      },
    });

    return npc === null ? null : this.mapper.toDomain(npc);
  }
}
