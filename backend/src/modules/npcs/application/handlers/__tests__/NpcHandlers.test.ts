import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";
import { CreateNpcCommand } from "@modules/npcs/application/commands/CreateNpcCommand";
import { GetNpcDetailsQuery } from "@modules/npcs/application/queries/GetNpcDetailsQuery";
import { CreateNpcHandler } from "@modules/npcs/application/handlers/CreateNpcHandler";
import { GetNpcDetailsHandler } from "@modules/npcs/application/handlers/GetNpcDetailsHandler";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import { Npc } from "@modules/npcs/domain/entities/Npc";
import { NpcAttitude } from "@modules/npcs/domain/value-objects/NpcAttitude";
import { NpcImportance } from "@modules/npcs/domain/value-objects/NpcImportance";
import { NpcStatus } from "@modules/npcs/domain/value-objects/NpcStatus";

function createCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "owner-1",
    name: CampaignName.create("Waterdeep"),
    slug: "waterdeep",
    description: null,
    gameSystemId: null,
    status: CampaignStatus.active(),
    visibility: CampaignVisibility.private(),
    coverImageUrl: null,
    coverImageKey: null,
    defaultLanguage: null,
    currentDateInWorld: null,
    worldName: null,
    startingLevel: null,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    archivedAt: null,
    deletedAt: null,
  });
}

function createCampaignMember(role: CampaignRole, userId: string): CampaignMember {
  return CampaignMember.create({
    id: "member-1",
    campaignId: "campaign-1",
    userId,
    role,
    status: MemberStatus.active(),
    nickname: null,
    joinedAt: new Date("2026-06-20T10:00:00.000Z"),
    invitedAt: null,
    invitedById: null,
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
  });
}

function createNpc(): Npc {
  return Npc.create({
    id: "npc-1",
    campaignId: "campaign-1",
    name: "Mirt",
    title: "The Moneylender",
    avatarUrl: null,
    race: "Human",
    occupation: "Fixer",
    faction: "Lords' Alliance",
    locationId: null,
    attitude: NpcAttitude.create("FRIENDLY"),
    importance: NpcImportance.create("MAJOR"),
    status: NpcStatus.alive(),
    publicDescription: "Influential patron",
    gmNotes: "Secret Harper contact",
    appearance: "Well dressed noble",
    personality: "Warm but calculating",
    motivations: "Keep Waterdeep stable",
    secrets: "Knows the vault route",
    statBlock: { ac: 12 },
    externalReferenceId: null,
    createdById: "gm-1",
    createdAt: new Date("2026-06-20T10:00:00.000Z"),
    updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    deletedAt: null,
  });
}

function createAccessService(role: CampaignRole, userId: string): CampaignAccessApplicationService {
  return {
    requirePermission: vi.fn().mockResolvedValue({
      campaign: createCampaign(),
      member: createCampaignMember(role, userId),
      role,
    }),
    requireMembership: vi.fn().mockResolvedValue({
      campaign: createCampaign(),
      member: createCampaignMember(role, userId),
      role,
    }),
  } as unknown as CampaignAccessApplicationService;
}

function createNpcRepository(npc: Npc): NpcRepository {
  return {
    findById: vi.fn().mockResolvedValue(npc),
    create: vi.fn(),
    save: vi.fn(),
  };
}

function createNpcReadRepository(npc: Npc): NpcReadRepository {
  return {
    listCampaignNpcs: vi.fn().mockResolvedValue([npc]),
    getNpcDetails: vi.fn().mockResolvedValue(npc),
  };
}

describe("NPC handlers", () => {
  const visibilityService = new CampaignVisibilityApplicationService(
    new CampaignPermissionDomainService(),
  );

  it("returns GM-only fields for campaign staff", async () => {
    const handler = new GetNpcDetailsHandler(
      createAccessService(CampaignRole.create("GM"), "gm-1"),
      visibilityService,
      createNpcReadRepository(createNpc()),
    );

    const result = await handler.execute(
      new GetNpcDetailsQuery({
        campaignId: "campaign-1",
        npcId: "npc-1",
        actorUserId: "gm-1",
      }),
    );

    expect(result).toHaveProperty("gmNotes", "Secret Harper contact");
    expect(result).toHaveProperty("motivations", "Keep Waterdeep stable");
    expect(result).toHaveProperty("secrets", "Knows the vault route");
  });

  it("hides GM-only fields from players", async () => {
    const handler = new GetNpcDetailsHandler(
      createAccessService(CampaignRole.player(), "player-1"),
      visibilityService,
      createNpcReadRepository(createNpc()),
    );

    const result = await handler.execute(
      new GetNpcDetailsQuery({
        campaignId: "campaign-1",
        npcId: "npc-1",
        actorUserId: "player-1",
      }),
    );

    expect(result).not.toHaveProperty("gmNotes");
    expect(result).not.toHaveProperty("motivations");
    expect(result).not.toHaveProperty("secrets");
  });

  it("creates NPC and returns GM view for staff", async () => {
    const repository = createNpcRepository(createNpc());
    const handler = new CreateNpcHandler(
      repository,
      createAccessService(CampaignRole.owner(), "owner-1"),
      visibilityService,
    );

    const result = await handler.execute(
      new CreateNpcCommand({
        campaignId: "campaign-1",
        actorUserId: "owner-1",
        name: "Vajra Safahr",
        gmNotes: "Open Lord ally",
        secrets: "Suspects the party warlock",
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty("gmNotes", "Open Lord ally");
    expect(result).toHaveProperty("secrets", "Suspects the party warlock");
  });

  it("surfaces forbidden error when non-staff tries to create NPC", async () => {
    const repository = createNpcRepository(createNpc());
    const accessService = {
      requirePermission: vi.fn().mockRejectedValue(new ForbiddenError("Insufficient campaign permissions")),
    } as unknown as CampaignAccessApplicationService;
    const handler = new CreateNpcHandler(repository, accessService, visibilityService);

    await expect(
      handler.execute(
        new CreateNpcCommand({
          campaignId: "campaign-1",
          actorUserId: "player-1",
          name: "Illegal NPC",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
