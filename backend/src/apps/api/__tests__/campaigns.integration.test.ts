import type { Container } from "inversify";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApiApp } from "@api/app";
import { loadApiContainerModule } from "@api/di/api.container-module";
import type { FileStorage } from "@core/application/storage/FileStorage";
import { buildContainer, type ContainerModuleLoader } from "@core/di/container";
import { CORE_TYPES } from "@core/di/core.types";
import { loadAuthContainerModule } from "@modules/auth/auth.container-module";
import { AUTH_TYPES } from "@modules/auth/auth.types";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";
import type { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import type { Email } from "@modules/auth/domain/value-objects/Email";
import { loadCampaignsContainerModule } from "@modules/campaigns/campaigns.container-module";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignInvitationDTO } from "@modules/campaigns/application/dto/CampaignInvitationDTO";
import type { CampaignListItemDTO } from "@modules/campaigns/application/dto/CampaignListItemDTO";
import type { CampaignMemberDTO } from "@modules/campaigns/application/dto/CampaignMemberDTO";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import type { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignMember } from "@modules/campaigns/domain/entities/CampaignMember";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { MemberStatus } from "@modules/campaigns/domain/value-objects/MemberStatus";

class InMemoryAuthRepository implements AuthRepository {
  private readonly usersById = new Map<string, UserCredentials>();
  private readonly userIdsByEmail = new Map<string, string>();

  public async findByEmail(email: Email): Promise<UserCredentials | null> {
    const userId = this.userIdsByEmail.get(email.value);

    if (!userId) {
      return null;
    }

    return this.usersById.get(userId) ?? null;
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

    if (!session) {
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
  public constructor(private readonly store: InMemoryCampaignStore) {}

  public async listForUser(userId: string): Promise<CampaignListItemDTO[]> {
    const campaigns: CampaignListItemDTO[] = [];

    for (const entry of this.store.memberships) {
      if (entry.userId !== userId) {
        continue;
      }

      const campaign = this.store.campaigns.get(entry.campaignId);

      if (!campaign || campaign.deletedAt !== null) {
        continue;
      }

      campaigns.push({
        id: campaign.id,
        ownerId: campaign.ownerId,
        name: campaign.name.value,
        slug: campaign.slug,
        description: campaign.description,
        status: campaign.status.value,
        visibility: campaign.visibility.value,
        coverImageUrl: campaign.coverImageUrl,
        worldName: campaign.worldName,
        role: entry.role.value,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        archivedAt: campaign.archivedAt?.toISOString() ?? null,
      });
    }

    return campaigns;
  }

  public async getDetailsForUser(campaignId: string, userId: string): Promise<CampaignDetailsDTO | null> {
    const membership = this.store.memberships.find(
      (entry) => entry.campaignId === campaignId && entry.userId === userId,
    );

    if (!membership) {
      return null;
    }

    const campaign = this.store.campaigns.get(campaignId);

    if (!campaign || campaign.deletedAt !== null) {
      return null;
    }

    return {
      id: campaign.id,
      ownerId: campaign.ownerId,
      name: campaign.name.value,
      slug: campaign.slug,
      description: campaign.description,
      gameSystemId: campaign.gameSystemId,
      status: campaign.status.value,
      visibility: campaign.visibility.value,
      coverImageUrl: campaign.coverImageUrl,
      defaultLanguage: campaign.defaultLanguage,
      currentDateInWorld: campaign.currentDateInWorld,
      worldName: campaign.worldName,
      startingLevel: campaign.startingLevel,
      role: membership.role.value,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      archivedAt: campaign.archivedAt?.toISOString() ?? null,
      deletedAt: null,
    };
  }

  public async listMembers(campaignId: string): Promise<CampaignMemberDTO[]> {
    return this.store.memberships
      .filter((entry) => entry.campaignId === campaignId)
      .map((entry, index) => ({
        id: `member-${index + 1}`,
        campaignId: entry.campaignId,
        userId: entry.userId,
        role: entry.role.value,
        status: "ACTIVE",
        nickname: null,
        joinedAt: null,
        invitedAt: null,
        invitedById: null,
        createdAt: new Date("2026-01-01T10:00:00.000Z").toISOString(),
        updatedAt: new Date("2026-01-01T10:00:00.000Z").toISOString(),
      }));
  }

  public async listInvitations(campaignId: string): Promise<CampaignInvitationDTO[]> {
    void campaignId;
    return [];
  }

  public async listInvitationsForUser(): Promise<CampaignInvitationDTO[]> {
    return [];
  }
}

class InMemoryCampaignMembershipRepository implements CampaignMembershipRepository {
  public constructor(private readonly store: InMemoryCampaignStore) {}

  public async findActiveMemberByUserId(
    campaignId: string,
    userId: string,
  ): Promise<CampaignMember | null> {
    const index = this.store.memberships.findIndex(
      (entry) => entry.campaignId === campaignId && entry.userId === userId,
    );

    if (index === -1) {
      return null;
    }

    const membership = this.store.memberships[index];

    if (membership === undefined) {
      return null;
    }

    return CampaignMember.create({
      id: `member-${index + 1}`,
      campaignId: membership.campaignId,
      userId: membership.userId,
      role: membership.role,
      status: MemberStatus.active(),
      nickname: null,
      joinedAt: new Date("2026-01-01T10:00:00.000Z"),
      invitedAt: null,
      invitedById: null,
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
      updatedAt: new Date("2026-01-01T10:00:00.000Z"),
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

  public async findMemberById(
    campaignId: string,
    memberId: string,
  ): Promise<CampaignMember | null> {
    const memberIndex = Number.parseInt(memberId.replace("member-", ""), 10) - 1;
    const membership = this.store.memberships[memberIndex];

    if (membership === undefined || membership.campaignId !== campaignId) {
      return null;
    }

    return CampaignMember.create({
      id: memberId,
      campaignId: membership.campaignId,
      userId: membership.userId,
      role: membership.role,
      status: MemberStatus.active(),
      nickname: null,
      joinedAt: new Date("2026-01-01T10:00:00.000Z"),
      invitedAt: null,
      invitedById: null,
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
      updatedAt: new Date("2026-01-01T10:00:00.000Z"),
    });
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
    throw new Error("Not implemented in campaigns API integration test");
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

function createCampaignsTestingModule(): ContainerModuleLoader {
  const store = new InMemoryCampaignStore();
  const campaignRepository = new InMemoryCampaignRepository(store);
  const campaignReadRepository = new InMemoryCampaignReadRepository(store);
  const campaignMembershipRepository = new InMemoryCampaignMembershipRepository(store);

  return (container: Container) => {
    container
      .rebind<CampaignRepository>(CAMPAIGNS_TYPES.CampaignRepository)
      .toConstantValue(campaignRepository);
    container
      .rebind<CampaignReadRepository>(CAMPAIGNS_TYPES.CampaignReadRepository)
      .toConstantValue(campaignReadRepository);
    container
      .rebind<CampaignMembershipRepository>(CAMPAIGNS_TYPES.CampaignMembershipRepository)
      .toConstantValue(campaignMembershipRepository);
  };
}

function createFileStorageTestingModule(): ContainerModuleLoader {
  const fileStorage: FileStorage = {
    async createPresignedUploadUrl(input) {
      return {
        uploadUrl: `https://upload.example.test/${input.key}`,
        publicUrl: `https://cdn.example.test/${input.key}`,
      };
    },
  };

  return (container: Container) => {
    container.rebind<FileStorage>(CORE_TYPES.FileStorage).toConstantValue(fileStorage);
  };
}

describe("Campaigns API flow", () => {
  it("creates campaign and lists it for authenticated user", async () => {
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(),
      createFileStorageTestingModule(),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const registerResponse = await request(app).post("/api/v1/auth/register").send({
      email: "campaigns@example.com",
      password: "password123",
    });

    expect(registerResponse.status).toBe(201);

    const createCampaignResponse = await request(app)
      .post("/api/v1/campaigns")
      .set("authorization", `Bearer ${registerResponse.body.accessToken}`)
      .send({
        name: "Heroes of Waterdeep",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);
    expect(createCampaignResponse.body.name).toBe("Heroes of Waterdeep");
    expect(createCampaignResponse.body.role).toBe("OWNER");

    const listCampaignsResponse = await request(app)
      .get("/api/v1/campaigns")
      .set("authorization", `Bearer ${registerResponse.body.accessToken}`);

    expect(listCampaignsResponse.status).toBe(200);
    expect(listCampaignsResponse.body).toHaveLength(1);
    expect(listCampaignsResponse.body[0].id).toBe(createCampaignResponse.body.id);
    expect(listCampaignsResponse.body[0].slug).toBe("heroes-of-waterdeep");

    const coverUploadResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/cover-image-upload`)
      .set("authorization", `Bearer ${registerResponse.body.accessToken}`)
      .send({
        fileName: "cover.webp",
        contentType: "image/webp",
      });

    expect(coverUploadResponse.status).toBe(201);
    expect(coverUploadResponse.body.uploadUrl).toContain("https://upload.example.test/");
    expect(coverUploadResponse.body.coverImageUrl).toContain(
      `/campaigns/${createCampaignResponse.body.id}/cover-images/`,
    );
  });
});


