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
import type { CharacterReadRepository } from "@modules/characters/application/ports/CharacterReadRepository";
import type { CharacterRepository } from "@modules/characters/application/ports/CharacterRepository";
import type { Character } from "@modules/characters/domain/entities/Character";
import type { CharacterDetailsDTO } from "@modules/characters/application/dto/CharacterDetailsDTO";
import type { CharacterListItemDTO } from "@modules/characters/application/dto/CharacterListItemDTO";
import { loadNotesContainerModule } from "@modules/notes/notes.container-module";
import { NOTES_TYPES } from "@modules/notes/notes.types";
import type { NoteReadRepository } from "@modules/notes/application/ports/NoteReadRepository";
import type { NoteRepository } from "@modules/notes/application/ports/NoteRepository";
import type { Note } from "@modules/notes/domain/entities/Note";
import type { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";

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
    throw new Error("Not implemented for notes integration test");
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

class InMemoryNoteStore {
  public readonly notes = new Map<string, Note>();
}

class InMemoryNoteRepository implements NoteRepository {
  public constructor(private readonly store: InMemoryNoteStore) {}

  public async findById(campaignId: string, noteId: string): Promise<Note | null> {
    const note = this.store.notes.get(noteId) ?? null;

    if (note === null || note.campaignId !== campaignId || note.deletedAt !== null) {
      return null;
    }

    return note;
  }

  public async create(note: Note): Promise<void> {
    this.store.notes.set(note.id, note);
  }

  public async save(note: Note): Promise<void> {
    this.store.notes.set(note.id, note);
  }
}

class InMemoryNoteReadRepository implements NoteReadRepository {
  public constructor(private readonly store: InMemoryNoteStore) {}

  public async listCampaignNotes(campaignId: string): Promise<Note[]> {
    return [...this.store.notes.values()]
      .filter((note) => note.campaignId === campaignId && note.deletedAt === null)
      .sort((left, right) => {
        if (left.isPinned !== right.isPinned) {
          return left.isPinned ? -1 : 1;
        }

        return right.updatedAt.getTime() - left.updatedAt.getTime();
      });
  }

  public async getNoteDetails(campaignId: string, noteId: string): Promise<Note | null> {
    const note = this.store.notes.get(noteId) ?? null;

    if (note === null || note.campaignId !== campaignId || note.deletedAt !== null) {
      return null;
    }

    return note;
  }

  public async listRelatedNotes(
    campaignId: string,
    relatedEntityType: RelatedEntityType,
    relatedEntityId: string,
  ): Promise<Note[]> {
    return [...this.store.notes.values()].filter(
      (note) =>
        note.campaignId === campaignId &&
        note.deletedAt === null &&
        note.relatedEntityType?.value === relatedEntityType.value &&
        note.relatedEntityId === relatedEntityId,
    );
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

function createNotesTestingModule(store: InMemoryNoteStore): ContainerModuleLoader {
  const noteRepository = new InMemoryNoteRepository(store);
  const noteReadRepository = new InMemoryNoteReadRepository(store);

  return (container: Container) => {
    container.rebind<NoteRepository>(NOTES_TYPES.NoteRepository).toConstantValue(noteRepository);
    container.rebind<NoteReadRepository>(NOTES_TYPES.NoteReadRepository).toConstantValue(noteReadRepository);
  };
}

describe("Notes API flow", () => {
  it("filters note visibility on the backend for players and staff", async () => {
    const campaignStore = new InMemoryCampaignStore();
    const characterStore = new InMemoryCharacterStore();
    const noteStore = new InMemoryNoteStore();
    const container = buildContainer(
      loadAuthContainerModule,
      loadCampaignsContainerModule,
      loadCharactersContainerModule,
      loadNotesContainerModule,
      createAuthTestingModule(),
      createCampaignsTestingModule(campaignStore),
      createCharactersTestingModule(characterStore),
      createNotesTestingModule(noteStore),
      loadApiContainerModule,
    );
    const app = createApiApp({ container });

    const ownerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "owner.notes@example.com",
      password: "password123",
    });
    const playerRegisterResponse = await request(app).post("/api/v1/auth/register").send({
      email: "player.notes@example.com",
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
        name: "Notes Campaign",
        visibility: "PRIVATE",
      });

    expect(createCampaignResponse.status).toBe(201);

    campaignStore.memberships.push({
      campaignId: createCampaignResponse.body.id,
      userId: playerMeResponse.body.id,
      role: CampaignRole.player(),
    });

    const characterResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/characters`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        name: "Kael",
        type: "PLAYER_CHARACTER",
        status: "ACTIVE",
      });

    expect(characterResponse.status).toBe(201);

    const publicNoteResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "Public note",
        content: "Everyone can see this.",
        visibility: "CAMPAIGN_PUBLIC",
      });

    expect(publicNoteResponse.status).toBe(201);

    const privateAuthorNoteResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "My note",
        content: "Only I should see this unless moderated.",
        visibility: "PRIVATE_AUTHOR",
      });

    expect(privateAuthorNoteResponse.status).toBe(201);

    const characterOwnerNoteResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "Character note",
        content: "Only my character owner side should see this.",
        visibility: "CHARACTER_OWNER",
        relatedEntityType: "CHARACTER",
        relatedEntityId: characterResponse.body.id,
      });

    expect(characterOwnerNoteResponse.status).toBe(201);

    const forbiddenPrivateGmResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`)
      .send({
        title: "Forbidden",
        content: "Player cannot create GM note.",
        visibility: "PRIVATE_GM",
      });

    expect(forbiddenPrivateGmResponse.status).toBe(403);

    const privateGmNoteResponse = await request(app)
      .post(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "GM secret",
        content: "Only staff should see this.",
        visibility: "PRIVATE_GM",
      });

    expect(privateGmNoteResponse.status).toBe(201);

    const playerListResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerListResponse.status).toBe(200);
    expect(playerListResponse.body).toHaveLength(3);
    expect(playerListResponse.body.some((note: { id: string }) => note.id === privateGmNoteResponse.body.id)).toBe(
      false,
    );

    const playerPrivateGmDetailsResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes/${privateGmNoteResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(playerPrivateGmDetailsResponse.status).toBe(404);

    const ownerListResponse = await request(app)
      .get(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`);

    expect(ownerListResponse.status).toBe(200);
    expect(ownerListResponse.body).toHaveLength(4);

    const ownerUpdatePrivateAuthorResponse = await request(app)
      .patch(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes/${privateAuthorNoteResponse.body.id}`)
      .set("authorization", `Bearer ${ownerRegisterResponse.body.accessToken}`)
      .send({
        title: "Moderated title",
      });

    expect(ownerUpdatePrivateAuthorResponse.status).toBe(200);
    expect(ownerUpdatePrivateAuthorResponse.body.title).toBe("Moderated title");

    const deletePublicNoteResponse = await request(app)
      .delete(`/api/v1/campaigns/${createCampaignResponse.body.id}/notes/${publicNoteResponse.body.id}`)
      .set("authorization", `Bearer ${playerRegisterResponse.body.accessToken}`);

    expect(deletePublicNoteResponse.status).toBe(204);
  });
});


