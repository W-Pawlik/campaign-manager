import type { Container } from "inversify";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApiApp } from "@api/app";
import { loadApiContainerModule } from "@api/di/api.container-module";
import { buildContainer, type ContainerModuleLoader } from "@core/di/container";
import { loadAuthContainerModule } from "@modules/auth/auth.container-module";
import { AUTH_TYPES } from "@modules/auth/auth.types";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";
import type { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import type { Email } from "@modules/auth/domain/value-objects/Email";
import { loadCampaignsContainerModule } from "@modules/campaigns/campaigns.container-module";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";
import { loadNpcsContainerModule } from "@modules/npcs/npcs.container-module";
import { NPCS_TYPES } from "@modules/npcs/npcs.types";
import type { NpcReadRepository } from "@modules/npcs/application/ports/NpcReadRepository";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";
import type { Npc } from "@modules/npcs/domain/entities/Npc";

class InMemoryAuthRepository implements AuthRepository {
  private readonly usersById = new Map<string, UserCredentials>();
  private readonly userIdsByEmail = new Map<string, string>();

  public async findByEmail(email: Email): Promise<UserCredentials | null> {
    const userId = this.userIdsByEmail.get(email.value);

    return userId === undefined ? null : (this.usersById.get(userId) ?? null);
  }

  public async findById(userId: string): Promise<UserCredentials | null> {
    return this.usersById.get(userId) ?? null;
  }

  public async create(userCredentials: UserCredentials): Promise<void> {
    this.usersById.set(userCredentials.id, userCredentials);
    this.userIdsByEmail.set(userCredentials.email.value, userCredentials.id);
  }
}

class InMemoryUserSessionRepository implements UserSessionRepository {
  private readonly sessions = new Map<string, RefreshToken>();

  public async create(session: RefreshToken): Promise<void> {
    this.sessions.set(session.id, session);
  }

  public async findById(sessionId: string): Promise<RefreshToken | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  public async revokeById(sessionId: string, revokedAt: Date): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (session === undefined) {
      return;
    }

    this.sessions.set(
      sessionId,
      RefreshToken.create({
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        revokedAt,
      }),
    );
  }
}

interface CampaignMembership {
  campaignId: string;
  userId: string;
  role: CampaignRole;
}

class InMemoryCampaignStore {
  public readonly campaigns = new Map<string, Campaign>();
  public readonly memberships: CampaignMembership[] = [];
}

class InMemoryCampaignRepository implements CampaignRepository {
  public constructor(private readonly store: InMemoryCampaignStore) {}

  public async findById(campaignId: string): Promise<Campaign | null> {
    return this.store.campaigns.get(campaignId) ?? null;
  }

  public async findBySlug(slug: string): Promise<Campaign | null> {
    for (const campaign of this.store.campaigns.values()) {
      if (campaign.slug === slug) {
        return campaign;
      }
    }

    return null;
  }

  public async findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null> {
    const membership = this.store.memberships.find(
      (entry) => entry.campaignId === campaignId && entry.userId === userId,
    );

    return membership?.role ?? null;
  }

  public async create(campaign: Campaign, ownerUserId: string): Promise<void> {
    this.store.campaigns.set(campaign.id, campaign);
    this.store.memberships.push({
      campaignId: campaign.id,
      userId: ownerUserId,
      role: CampaignRole.owner(),
    });
  }

  public async save(campaign: Campaign): Promise<void> {
    this.store.campaigns.set(campaign.id, campaign);
  }
}

class InMemoryCampaignReadRepository implements CampaignReadRepository {
  public async listForUser(): Promise<never[]> {
    return [];
  }

  public async getDetailsForUser(): Promise<null> {
    return null;
  }

  public async listMembers(): Promise<never[]> {
    return [];
  }

  public async listInvitations(): Promise<never[]> {
    return [];
  }
}

class InMemoryCampaignMembershipRepository implements CampaignMembershipRepository {
  public constructor(private readonly store: InMemoryCampaignStore) {}

  public async findActiveMemberByUserId(campaignId: string, userId: string): Promise<CampaignMember | null> {
    const membership = this.store.memberships.find(
      (entry) => entry.campaignId === campaignId && entry.userId === userId,
    );

    if (membership === undefined) {
      return null;
    }

    return CampaignMember.create({
      id: `${campaignId}-${userId}`,
      campaignId,
      userId,
      role: membership.role,
      status: MemberStatus.active(),
      nickname: null,
      joinedAt: new Date("2026-06-20T10:00:00.000Z"),
      invitedAt: null,
      invitedById: null,
      createdAt: new Date("2026-06-20T10:00:00.000Z"),
      updatedAt: new Date("2026-06-20T10:00:00.000Z"),
    });
  }

  public async findMemberById(): Promise<CampaignMember | null> {
    return null;
  }

  public async findActiveInvitationByUserId(): Promise<null> {
    return null;
  }

  public async findInvitationById(): Promise<null> {
    return null;
  }

  public async createInvitation(): Promise<void> {}

  public async saveInvitation(): Promise<void> {}

  public async upsertActiveMemberFromInvitation(): Promise<CampaignMember> {
    throw new Error("Not implemented for NPC integration test");
  }

  public async saveMember(): Promise<void> {}

  public async transferOwnership(): Promise<void> {}

  public async countActiveOwners(campaignId: string): Promise<number> {
    return this.store.memberships.filter(
      (entry) => entry.campaignId === campaignId && entry.role.isOwner(),
    ).length;
  }

  public async findUserRole(campaignId: string, userId: string): Promise<CampaignRole | null> {
    const membership = this.store.memberships.find(
      (entry) => entry.campaignId === campaignId && entry.userId === userId,
    );

    return membership?.role ?? null;
  }
}

class InMemoryNpcStore {
  public readonly npcs = new Map<string, Npc>();
}

class InMemoryNpcRepository implements NpcRepository {
  public constructor(private readonly store: InMemoryNpcStore) {}

  public async findById(campaignId: string, npcId: string): Promise<Npc | null> {
    const npc = this.store.npcs.get(npcId) ?? null;

    if (npc === null || npc.campaignId !== campaignId || npc.deletedAt !== null) {
      return null;
    }

    return npc;
  }

  public async create(npc: Npc): Promise<void> {
    this.store.npcs.set(npc.id, npc);
  }

  public async save(npc: Npc): Promise<void> {
    this.store.npcs.set(npc.id, npc);
  }
}

class InMemoryNpcReadRepository implements NpcReadRepository {
  public constructor(private readonly store: InMemoryNpcStore) {}

  public async listCampaignNpcs(campaignId: string): Promise<Npc[]> {
    return [...this.store.npcs.values()].filter(
      (npc) => npc.campaignId === campaignId && npc.deletedAt === null,
    );
  }

  public async getNpcDetails(campaignId: string, npcId: string): Promise<Npc | null> {
    const npc = this.store.npcs.get(npcId) ?? null;

    if (npc === null || npc.campaignId !== campaignId || npc.deletedAt !== null) {
      return null;
    }

    return npc;
  }
}

function createAuthTestingModule(): ContainerModuleLoader {
  const authRepository = new InMemoryAuthRepository();
  const userSessionRepository = new InMemoryUserSessionRepository();

  return (container: Container) => {
    container.rebind<AuthRepository>(AUTH_TYPES.AuthRepository).toConstantValue(authRepository);
    container
      .rebind<UserSessionRepository>(AUTH_TYPES.UserSessionRepository)
      .toConstantValue(userSessionRepository);
  };
}

function createCampaignsTestingModule(store: InMemoryCampaignStore): ContainerModuleLoader {
  const campaignRepository = new InMemoryCampaignRepository(store);
  const campaignReadRepository = new InMemoryCampaignReadRepository();
  const membershipRepository = new InMemoryCampaignMembershipRepository(store);

  return (container: Container) => {
    container
      .rebind<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository)
      .toConstantValue(campaignRepository);
    container
      .rebind<CampaignReadRepository>(CAMPAIGNS_TYPES.CampaignReadRepository)
      .toConstantValue(campaignReadRepository);
    container
      .rebind<CampaignMembershipRepository>(CAMPAIGNS_TYPES.CampaignMembershipRepository)
      .toConstantValue(membershipRepository);
  };
}

function createNpcsTestingModule(store: InMemoryNpcStore): ContainerModuleLoader {
  const npcRepository = new InMemoryNpcRepository(store);
  const npcReadRepository = new InMemoryNpcReadRepository(store);

  return (container: Container) => {
    container.rebind<NpcRepository>(NPCS_TYPES.NpcRepository).toConstantValue(npcRepository);
    container.rebind<NpcReadRepository>(NPCS_TYPES.NpcReadRepository).toConstantValue(npcReadRepository);
  };
}

describe("NPCs API flow", () => {
  it("shows only public NPC data to players and full details to staff", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const npcStore = new InMemoryNpcStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadNpcsContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createNpcsTestingModule(npcStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.npcs@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.npcs@example.com",
      password: "password123",
    });

    expect(ownerRegisterResponse.status).toBe(201);
    expect(playerRegisterResponse.status).toBe(201);

    const ownerMeResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);
    const playerMeResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(ownerMeResponse.status).toBe(200);
    expect(playerMeResponse.status).toBe(200);

    const createCampaignResponse = await request(app)
      .post("/api/v1/campaigns")
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "NPC Campaign",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const createNpcResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Mirt",
        publicDescription: "A wealthy patron with a wide network.",
        gmNotes: "Harper asset with hidden agenda.",
        motivations: "Protect the city from internal collapse.",
        secrets: "Knows who holds the stolen key.",
        importance: "MAJOR",
      });

    expect(createNpcResponse.status).toBe(201);
    expect(createNpcResponse.body.gmNotes).toBe("Harper asset with hidden agenda.");

    const listForPlayerResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(listForPlayerResponse.status).toBe(200);
    expect(listForPlayerResponse.body).toHaveLength(1);
    expect(listForPlayerResponse.body[0]).not.toHaveProperty("gmNotes");
    expect(listForPlayerResponse.body[0]).not.toHaveProperty("motivations");
    expect(listForPlayerResponse.body[0]).not.toHaveProperty("secrets");
    expect(listForPlayerResponse.body[0].publicDescription).toBe(
      "A wealthy patron with a wide network.",
    );

    const detailsForPlayerResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs/${createNpcResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(detailsForPlayerResponse.status).toBe(200);
    expect(detailsForPlayerResponse.body).not.toHaveProperty("gmNotes");
    expect(detailsForPlayerResponse.body).not.toHaveProperty("motivations");
    expect(detailsForPlayerResponse.body).not.toHaveProperty("secrets");

    const createNpcAsPlayerResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        name: "Illegal NPC",
      });

    expect(createNpcAsPlayerResponse.status).toBe(403);

    const detailsForOwnerResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs/${createNpcResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(detailsForOwnerResponse.status).toBe(200);
    expect(detailsForOwnerResponse.body.gmNotes).toBe("Harper asset with hidden agenda.");
    expect(detailsForOwnerResponse.body.motivations).toBe(
      "Protect the city from internal collapse.",
    );
    expect(detailsForOwnerResponse.body.secrets).toBe("Knows who holds the stolen key.");

    const updateNpcResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs/${createNpcResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        status: "MISSING",
        gmNotes: "Last seen near the docks.",
      });

    expect(updateNpcResponse.status).toBe(200);
    expect(updateNpcResponse.body.status).toBe("MISSING");
    expect(updateNpcResponse.body.gmNotes).toBe("Last seen near the docks.");

    const deleteNpcResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs/${createNpcResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deleteNpcResponse.status).toBe(204);

    const deletedNpcResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/npcs/${createNpcResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deletedNpcResponse.status).toBe(404);
  });
});
