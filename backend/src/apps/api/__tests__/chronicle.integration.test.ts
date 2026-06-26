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
import { loadChronicleContainerModule } from "@modules/chronicle/chronicle.container-module";
import { CHRONICLE_TYPES } from "@modules/chronicle/chronicle.types";
import type { ChronicleEntryReadRepository } from "@modules/chronicle/application/ports/ChronicleEntryReadRepository";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import type { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";

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

  public async listInvitationsForUser(): Promise<never[]> {
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
      joinedAt: new Date("2026-06-21T10:00:00.000Z"),
      invitedAt: null,
      invitedById: null,
      createdAt: new Date("2026-06-21T10:00:00.000Z"),
      updatedAt: new Date("2026-06-21T10:00:00.000Z"),
    });
  }

  public async listActiveMembers(campaignId: string): Promise<CampaignMember[]> {
    const members = await Promise.all(
      this.store.memberships
        .filter((entry) => entry.campaignId === campaignId)
        .map((entry) => this.findActiveMemberByUserId(entry.campaignId, entry.userId)),
    );

    return members.filter((member): member is CampaignMember => member !== null);
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
    throw new Error("Not implemented for chronicle integration test");
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

class InMemoryChronicleStore {
  public readonly entries = new Map<string, ChronicleEntry>();
}

class InMemoryChronicleEntryRepository implements ChronicleEntryRepository {
  public constructor(private readonly store: InMemoryChronicleStore) {}

  public async findById(campaignId: string, entryId: string): Promise<ChronicleEntry | null> {
    const entry = this.store.entries.get(entryId) ?? null;

    if (entry === null || entry.campaignId !== campaignId) {
      return null;
    }

    return entry;
  }

  public async create(entry: ChronicleEntry): Promise<void> {
    this.store.entries.set(entry.id, entry);
  }

  public async save(entry: ChronicleEntry): Promise<void> {
    this.store.entries.set(entry.id, entry);
  }

  public async delete(campaignId: string, entryId: string): Promise<void> {
    const entry = this.store.entries.get(entryId);

    if (entry !== undefined && entry.campaignId === campaignId) {
      this.store.entries.delete(entryId);
    }
  }
}

class InMemoryChronicleEntryReadRepository implements ChronicleEntryReadRepository {
  public constructor(private readonly store: InMemoryChronicleStore) {}

  public async listCampaignChronicle(campaignId: string): Promise<ChronicleEntry[]> {
    return [...this.store.entries.values()]
      .filter((entry) => entry.campaignId === campaignId)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }

  public async getChronicleEntryDetails(campaignId: string, entryId: string): Promise<ChronicleEntry | null> {
    const entry = this.store.entries.get(entryId) ?? null;

    if (entry === null || entry.campaignId !== campaignId) {
      return null;
    }

    return entry;
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

function createChronicleTestingModule(store: InMemoryChronicleStore): ContainerModuleLoader {
  const chronicleEntryRepository = new InMemoryChronicleEntryRepository(store);
  const chronicleEntryReadRepository = new InMemoryChronicleEntryReadRepository(store);

  return (container: Container) => {
    container
      .rebind<ChronicleEntryRepository>(CHRONICLE_TYPES.ChronicleEntryRepository)
      .toConstantValue(chronicleEntryRepository);
    container
      .rebind<ChronicleEntryReadRepository>(CHRONICLE_TYPES.ChronicleEntryReadRepository)
      .toConstantValue(chronicleEntryReadRepository);
  };
}

describe("Chronicle API flow", () => {
  it("filters chronicle visibility on the backend for authors, members and staff", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const chronicleStore = new InMemoryChronicleStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadChronicleContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createChronicleTestingModule(chronicleStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.chronicle@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.chronicle@example.com",
      password: "password123",
    });
    const outsiderRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "outsider.chronicle@example.com",
      password: "password123",
    });

    expect(ownerRegisterResponse.status).toBe(201);
    expect(playerRegisterResponse.status).toBe(201);
    expect(outsiderRegisterResponse.status).toBe(201);

    const ownerMeResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);
    const playerMeResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);
    const outsiderMeResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${outsiderRegisterResponse.body.accessToken}`);

    expect(ownerMeResponse.status).toBe(200);
    expect(playerMeResponse.status).toBe(200);
    expect(outsiderMeResponse.status).toBe(200);

    const createCampaignResponse = await request(app)
      .post("/api/v1/campaigns")
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Chronicle Campaign",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });
    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: outsiderMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const playerDraftEntryResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "Player draft",
        content: "Private draft for the author and GM.",
        visibility: "DRAFT",
      });

    expect(playerDraftEntryResponse.status).toBe(201);

    const gmOnlyEntryResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "GM only",
        content: "Secret campaign notes.",
        visibility: "GM_ONLY",
      });

    expect(gmOnlyEntryResponse.status).toBe(201);

    const publicEntryResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "Public chronicle",
        content: "Visible to every campaign member.",
        visibility: "PUBLIC",
      });

    expect(publicEntryResponse.status).toBe(201);

    const playerListResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerListResponse.status).toBe(200);
    expect(playerListResponse.body).toHaveLength(2);
    expect(playerListResponse.body.some((entry: { id: string }) => entry.id === gmOnlyEntryResponse.body.id)).toBe(false);
    expect(playerListResponse.body.some((entry: { id: string }) => entry.id === playerDraftEntryResponse.body.id)).toBe(true);

    const outsiderListResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle`)
      .set("authorization", `Bearer ${outsiderRegisterResponse.body.accessToken}`);

    expect(outsiderListResponse.status).toBe(200);
    expect(outsiderListResponse.body).toHaveLength(1);
    expect(outsiderListResponse.body[0].id).toBe(publicEntryResponse.body.id);

    const outsiderDraftDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle/${playerDraftEntryResponse.body.id}`)
      .set("authorization", `Bearer ${outsiderRegisterResponse.body.accessToken}`);

    expect(outsiderDraftDetailsResponse.status).toBe(404);

    const ownerDraftDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle/${playerDraftEntryResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(ownerDraftDetailsResponse.status).toBe(200);
    expect(ownerDraftDetailsResponse.body.visibility).toBe("DRAFT");

    const ownerUpdatePlayerDraftResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle/${playerDraftEntryResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "GM edited draft",
      });

    expect(ownerUpdatePlayerDraftResponse.status).toBe(200);
    expect(ownerUpdatePlayerDraftResponse.body.title).toBe("GM edited draft");

    const outsiderUpdatePlayerDraftResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle/${playerDraftEntryResponse.body.id}`)
      .set("authorization", `Bearer ${outsiderRegisterResponse.body.accessToken}`)
      .send({
        title: "Illegal edit",
      });

    expect(outsiderUpdatePlayerDraftResponse.status).toBe(403);

    const ownerDeleteGmOnlyResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/chronicle/${gmOnlyEntryResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(ownerDeleteGmOnlyResponse.status).toBe(204);
  });
});
