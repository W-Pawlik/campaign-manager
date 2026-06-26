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
import { loadCharactersContainerModule } from "@modules/characters/characters.container-module";
import { CHARACTERS_TYPES } from "@modules/characters/characters.types";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { Character } from "@modules/characters/domain/entities/Character";

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
    throw new Error("Not implemented for characters integration test");
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

class InMemoryCharacterStore {
  public readonly characters = new Map<string, Character>();
}

class InMemoryCharacterRepository implements CharacterRepository {
  public constructor(private readonly store: InMemoryCharacterStore) {}

  public async findById(campaignId: string, characterId: string): Promise<Character | null> {
    const character = this.store.characters.get(characterId) ?? null;

    if (character === null || character.campaignId !== campaignId || character.deletedAt !== null) {
      return null;
    }

    return character;
  }

  public async create(character: Character): Promise<void> {
    this.store.characters.set(character.id, character);
  }

  public async save(character: Character): Promise<void> {
    this.store.characters.set(character.id, character);
  }
}

class InMemoryCharacterReadRepository implements CharacterReadRepository {
  public constructor(private readonly store: InMemoryCharacterStore) {}

  public async listCampaignCharacters(campaignId: string): Promise<CharacterListItemDTO[]> {
    return [...this.store.characters.values()]
      .filter((character) => character.campaignId === campaignId && character.deletedAt === null)
      .map((character) => ({
        id: character.id,
        campaignId: character.campaignId,
        ownerUserId: character.ownerUserId,
        name: character.name,
        avatarUrl: character.avatarUrl,
        type: character.type.value,
        status: character.status.value,
        race: character.race,
        characterClass: character.characterClass,
        level: character.level,
        updatedAt: character.updatedAt.toISOString(),
      }));
  }

  public async getCharacterDetails(campaignId: string, characterId: string): Promise<CharacterDetailsDTO | null> {
    const character = this.store.characters.get(characterId) ?? null;

    if (character === null || character.campaignId !== campaignId || character.deletedAt !== null) {
      return null;
    }

    return {
      id: character.id,
      campaignId: character.campaignId,
      ownerUserId: character.ownerUserId,
      sheetTemplateId: character.sheetTemplateId,
      name: character.name,
      avatarUrl: character.avatarUrl,
      type: character.type.value,
      status: character.status.value,
      race: character.race,
      characterClass: character.characterClass,
      subclass: character.subclass,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      experiencePoints: character.experiencePoints,
      armorClass: character.armorClass,
      initiativeBonus: character.initiativeBonus,
      speed: character.speed,
      maxHitPoints: character.maxHitPoints,
      currentHitPoints: character.currentHitPoints,
      temporaryHitPoints: character.temporaryHitPoints,
      hitDice: character.hitDice,
      strength: character.strength,
      dexterity: character.dexterity,
      constitution: character.constitution,
      intelligence: character.intelligence,
      wisdom: character.wisdom,
      charisma: character.charisma,
      proficiencyBonus: character.proficiencyBonus,
      savingThrows: character.savingThrows,
      skills: character.skills,
      proficiencies: character.proficiencies,
      languages: character.languages,
      attacksAndSpellcasting: character.attacksAndSpellcasting,
      spellcasting: character.spellcasting,
      featuresAndTraits: character.featuresAndTraits,
      personalityTraits: character.personalityTraits,
      ideals: character.ideals,
      bonds: character.bonds,
      flaws: character.flaws,
      backstory: character.backstory,
      appearance: character.appearance,
      customData: character.customData,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
      deletedAt: null,
    };
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

function createCharactersTestingModule(store: InMemoryCharacterStore): ContainerModuleLoader {
  const characterRepository = new InMemoryCharacterRepository(store);
  const characterReadRepository = new InMemoryCharacterReadRepository(store);

  return (container: Container) => {
    container
      .rebind<CharacterRepository>(CHARACTERS_TYPES.CharacterRepository)
      .toConstantValue(characterRepository);
    container
      .rebind<CharacterReadRepository>(CHARACTERS_TYPES.CharacterReadRepository)
      .toConstantValue(characterReadRepository);
  };
}

describe("Characters API flow", () => {
  it("lets members manage own characters and staff manage all campaign characters", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const characterStore = new InMemoryCharacterStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadCharactersContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createCharactersTestingModule(characterStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.characters@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.characters@example.com",
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
        name: "Characters Campaign",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const ownerCharacterResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        name: "Seraphina",
        type: "PLAYER_CHARACTER",
        status: "ACTIVE",
      });

    expect(ownerCharacterResponse.status).toBe(201);

    const playerCharacterResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        name: "Kael",
        type: "PLAYER_CHARACTER",
        status: "ACTIVE",
      });

    expect(playerCharacterResponse.status).toBe(201);
    expect(playerCharacterResponse.body.ownerUserId).toBe(playerMeResponse.body.id);

    const listCharactersResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(listCharactersResponse.status).toBe(200);
    expect(listCharactersResponse.body).toHaveLength(2);

    const updateOwnCharacterResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${playerCharacterResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        level: 4,
        characterClass: "Rogue",
      });

    expect(updateOwnCharacterResponse.status).toBe(200);
    expect(updateOwnCharacterResponse.body.level).toBe(4);

    const updateForeignCharacterResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${ownerCharacterResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        level: 7,
      });

    expect(updateForeignCharacterResponse.status).toBe(403);

    const archiveCharacterResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${playerCharacterResponse.body.id}/archive`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(archiveCharacterResponse.status).toBe(204);

    const archivedDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${playerCharacterResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(archivedDetailsResponse.status).toBe(200);
    expect(archivedDetailsResponse.body.status).toBe("ARCHIVED");

    const deleteCharacterResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${playerCharacterResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deleteCharacterResponse.status).toBe(204);

    const deletedDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters/${playerCharacterResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(deletedDetailsResponse.status).toBe(404);
  });
});


