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
import { loadLocationsContainerModule } from "@modules/locations/locations.container-module";
import { LOCATIONS_TYPES } from "@modules/locations/locations.types";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { Location } from "@modules/locations/domain/entities/Location";

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
    throw new Error("Not implemented for locations integration test");
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

class InMemoryLocationStore {
  public readonly locations = new Map<string, Location>();
}

class InMemoryLocationRepository implements LocationRepository {
  public constructor(private readonly store: InMemoryLocationStore) {}

  public async findById(campaignId: string, locationId: string): Promise<Location | null> {
    const location = this.store.locations.get(locationId) ?? null;

    if (location === null || location.campaignId !== campaignId || location.deletedAt !== null) {
      return null;
    }

    return location;
  }

  public async create(location: Location): Promise<void> {
    this.store.locations.set(location.id, location);
  }

  public async save(location: Location): Promise<void> {
    this.store.locations.set(location.id, location);
  }
}

class InMemoryLocationReadRepository implements LocationReadRepository {
  public constructor(private readonly store: InMemoryLocationStore) {}

  public async listCampaignLocations(campaignId: string): Promise<Location[]> {
    return [...this.store.locations.values()].filter(
      (location) => location.campaignId === campaignId && location.deletedAt === null,
    );
  }

  public async getLocationDetails(campaignId: string, locationId: string): Promise<Location | null> {
    const location = this.store.locations.get(locationId) ?? null;

    if (location === null || location.campaignId !== campaignId || location.deletedAt !== null) {
      return null;
    }

    return location;
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

function createLocationsTestingModule(store: InMemoryLocationStore): ContainerModuleLoader {
  const locationRepository = new InMemoryLocationRepository(store);
  const locationReadRepository = new InMemoryLocationReadRepository(store);

  return (container: Container) => {
    container
      .rebind<LocationRepository>(LOCATIONS_TYPES.LocationRepository)
      .toConstantValue(locationRepository);
    container
      .rebind<LocationReadRepository>(LOCATIONS_TYPES.LocationReadRepository)
      .toConstantValue(locationReadRepository);
  };
}

describe("Locations API flow", () => {
  it("enforces hierarchy rules and hides GM-only locations from players", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const locationStore = new InMemoryLocationStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadLocationsContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createLocationsTestingModule(locationStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.locations@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.locations@example.com",
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

    const createCampaignResponse = await request(app)
      .post("/api/v1/campaigns")
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Locations Campaign",
        visibility: "PRIVATE",
      });

    expect(ownerMeResponse.status).toBe(200);
    expect(playerMeResponse.status).toBe(200);
    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const worldResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Faerun",
        type: "WORLD",
        visibility: "PUBLIC",
      });

    expect(worldResponse.status).toBe(201);

    const cityResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Waterdeep",
        type: "CITY",
        parentLocationId: worldResponse.body.id,
        visibility: "DISCOVERED",
      });

    expect(cityResponse.status).toBe(201);

    const gmOnlyResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Xanathar Hideout",
        type: "DUNGEON",
        visibility: "GM_ONLY",
        gmNotes: "Secret sewer entrance",
      });

    expect(gmOnlyResponse.status).toBe(201);
    expect(gmOnlyResponse.body.gmNotes).toBe("Secret sewer entrance");

    const playerCreateResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        name: "Illegal Place",
      });

    expect(playerCreateResponse.status).toBe(403);

    const playerListResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerListResponse.status).toBe(200);
    expect(playerListResponse.body).toHaveLength(2);
    expect(playerListResponse.body.some((location: { id: string }) => location.id === gmOnlyResponse.body.id)).toBe(
      false,
    );

    const gmDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations/${gmOnlyResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(gmDetailsResponse.status).toBe(200);
    expect(gmDetailsResponse.body.gmNotes).toBe("Secret sewer entrance");

    const playerHiddenDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations/${gmOnlyResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerHiddenDetailsResponse.status).toBe(404);

    const cycleResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations/${worldResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        parentLocationId: cityResponse.body.id,
      });

    expect(cycleResponse.status).toBe(400);

    const deleteWorldResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations/${worldResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deleteWorldResponse.status).toBe(403);

    const deleteCityResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/locations/${cityResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deleteCityResponse.status).toBe(204);
  });
});
