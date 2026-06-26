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
import { loadSessionsContainerModule } from "@modules/sessions/sessions.container-module";
import { SESSIONS_TYPES } from "@modules/sessions/sessions.types";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import type { GameSessionDetailsReadModel } from "@modules/sessions/application/dto/GameSessionDetailsReadModel";
import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

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
      joinedAt: new Date("2026-06-20T10:00:00.000Z"),
      invitedAt: null,
      invitedById: null,
      createdAt: new Date("2026-06-20T10:00:00.000Z"),
      updatedAt: new Date("2026-06-20T10:00:00.000Z"),
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
    throw new Error("Not implemented for sessions integration test");
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

class InMemorySessionStore {
  public readonly sessions = new Map<string, GameSession>();
  public readonly participants = new Map<string, SessionParticipant>();
}

class InMemoryGameSessionRepository implements GameSessionRepository {
  public constructor(private readonly store: InMemorySessionStore) {}

  public async findById(campaignId: string, sessionId: string): Promise<GameSession | null> {
    const session = this.store.sessions.get(sessionId) ?? null;

    if (session === null || session.campaignId !== campaignId) {
      return null;
    }

    return session;
  }

  public async create(session: GameSession): Promise<void> {
    this.store.sessions.set(session.id, session);
  }

  public async save(session: GameSession): Promise<void> {
    this.store.sessions.set(session.id, session);
  }
}

class InMemoryGameSessionReadRepository implements GameSessionReadRepository {
  public constructor(private readonly store: InMemorySessionStore) {}

  public async listCampaignSessions(campaignId: string): Promise<GameSession[]> {
    return [...this.store.sessions.values()]
      .filter((session) => session.campaignId === campaignId)
      .sort((left, right) => {
        const leftTime = left.scheduledStartAt?.getTime() ?? 0;
        const rightTime = right.scheduledStartAt?.getTime() ?? 0;

        return leftTime - rightTime;
      });
  }

  public async getSessionDetails(campaignId: string, sessionId: string): Promise<GameSessionDetailsReadModel | null> {
    const session = this.store.sessions.get(sessionId) ?? null;

    if (session === null || session.campaignId !== campaignId) {
      return null;
    }

    return {
      session,
      participants: [...this.store.participants.values()]
        .filter((participant) => participant.sessionId === sessionId)
        .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime()),
    };
  }

  public async listSessionParticipants(campaignId: string, sessionId: string): Promise<SessionParticipant[]> {
    const session = this.store.sessions.get(sessionId) ?? null;

    if (session === null || session.campaignId !== campaignId) {
      return [];
    }

    return [...this.store.participants.values()].filter((participant) => participant.sessionId === sessionId);
  }
}

class InMemorySessionParticipantRepository implements SessionParticipantRepository {
  public constructor(private readonly store: InMemorySessionStore) {}

  public async createMany(participants: SessionParticipant[]): Promise<void> {
    for (const participant of participants) {
      this.store.participants.set(participant.id, participant);
    }
  }

  public async findByUserId(sessionId: string, userId: string): Promise<SessionParticipant | null> {
    for (const participant of this.store.participants.values()) {
      if (participant.sessionId === sessionId && participant.userId === userId) {
        return participant;
      }
    }

    return null;
  }

  public async save(participant: SessionParticipant): Promise<void> {
    this.store.participants.set(participant.id, participant);
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

function createSessionsTestingModule(store: InMemorySessionStore): ContainerModuleLoader {
  const gameSessionRepository = new InMemoryGameSessionRepository(store);
  const gameSessionReadRepository = new InMemoryGameSessionReadRepository(store);
  const sessionParticipantRepository = new InMemorySessionParticipantRepository(store);

  return (container: Container) => {
    container
      .rebind<GameSessionRepository>(SESSIONS_TYPES.GameSessionRepository)
      .toConstantValue(gameSessionRepository);
    container
      .rebind<GameSessionReadRepository>(SESSIONS_TYPES.GameSessionReadRepository)
      .toConstantValue(gameSessionReadRepository);
    container
      .rebind<SessionParticipantRepository>(SESSIONS_TYPES.SessionParticipantRepository)
      .toConstantValue(sessionParticipantRepository);
  };
}

describe("Sessions API flow", () => {
  it("allows staff to manage sessions and filters private summary for players", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const sessionStore = new InMemorySessionStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadSessionsContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createSessionsTestingModule(sessionStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.sessions@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.sessions@example.com",
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
        name: "Sessions Campaign",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const createSessionResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "Session Zero",
        status: "PLANNED",
        scheduledStartAt: "2026-06-22T18:00:00.000Z",
        scheduledEndAt: "2026-06-22T22:00:00.000Z",
        locationType: "ONLINE",
        meetingUrl: "https://example.com/session-zero",
        summaryPublic: "Public summary",
        summaryPrivate: "Private GM summary",
      });

    expect(createSessionResponse.status).toBe(201);
    expect(createSessionResponse.body.participants).toHaveLength(2);
    expect(createSessionResponse.body.summaryPrivate).toBe("Private GM summary");

    const playerDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions/${createSessionResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerDetailsResponse.status).toBe(200);
    expect(playerDetailsResponse.body.summaryPublic).toBe("Public summary");
    expect(playerDetailsResponse.body).not.toHaveProperty("summaryPrivate");

    const confirmAttendanceResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions/${createSessionResponse.body.id}/confirm`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(confirmAttendanceResponse.status).toBe(200);
    expect(confirmAttendanceResponse.body.attendanceStatus).toBe("CONFIRMED");

    const playerUpdateResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions/${createSessionResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "Player edit attempt",
      });

    expect(playerUpdateResponse.status).toBe(403);

    const ownerDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions/${createSessionResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(ownerDetailsResponse.status).toBe(200);
    expect(ownerDetailsResponse.body.summaryPrivate).toBe("Private GM summary");
    expect(ownerDetailsResponse.body.participants).toHaveLength(2);
    expect(
      ownerDetailsResponse.body.participants.some(
        (participant: { userId: string; attendanceStatus: string }) =>
          participant.userId === playerMeResponse.body.id && participant.attendanceStatus === "CONFIRMED",
      ),
    ).toBe(true);

    const completeSessionResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/sessions/${createSessionResponse.body.id}/complete`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(completeSessionResponse.status).toBe(200);
    expect(completeSessionResponse.body.status).toBe("COMPLETED");
  });
});
