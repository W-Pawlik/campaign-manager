import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { UnauthorizedError, ValidationError } from "@core/application/errors/AppError";
import { AcceptCampaignInvitationCommand } from "@modules/campaigns/application/commands/AcceptCampaignInvitationCommand";
import { ArchiveCampaignCommand } from "@modules/campaigns/application/commands/ArchiveCampaignCommand";
import { ChangeCampaignMemberRoleCommand } from "@modules/campaigns/application/commands/ChangeCampaignMemberRoleCommand";
import { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { DeclineCampaignInvitationCommand } from "@modules/campaigns/application/commands/DeclineCampaignInvitationCommand";
import { DeleteCampaignCommand } from "@modules/campaigns/application/commands/DeleteCampaignCommand";
import { InviteCampaignMemberCommand } from "@modules/campaigns/application/commands/InviteCampaignMemberCommand";
import { RemoveCampaignMemberCommand } from "@modules/campaigns/application/commands/RemoveCampaignMemberCommand";
import { RestoreCampaignCommand } from "@modules/campaigns/application/commands/RestoreCampaignCommand";
import { TransferCampaignOwnershipCommand } from "@modules/campaigns/application/commands/TransferCampaignOwnershipCommand";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { GetCampaignDetailsQuery } from "@modules/campaigns/application/queries/GetCampaignDetailsQuery";
import { ListCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCampaignInvitationsQuery";
import { ListCampaignMembersQuery } from "@modules/campaigns/application/queries/ListCampaignMembersQuery";
import { ListUserCampaignsQuery } from "@modules/campaigns/application/queries/ListUserCampaignsQuery";
import { ArchiveCharacterCommand } from "@modules/characters/application/commands/ArchiveCharacterCommand";
import { CreateCharacterCommand } from "@modules/characters/application/commands/CreateCharacterCommand";
import { DeleteCharacterCommand } from "@modules/characters/application/commands/DeleteCharacterCommand";
import { UpdateCharacterCommand } from "@modules/characters/application/commands/UpdateCharacterCommand";
import { GetCharacterDetailsQuery } from "@modules/characters/application/queries/GetCharacterDetailsQuery";
import { ListCampaignCharactersQuery } from "@modules/characters/application/queries/ListCampaignCharactersQuery";

export class CampaignsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listUserCampaigns(_req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(new ListUserCampaignsQuery({ userId }));

    res.status(200).json(result);
  }

  public async createCampaign(req: Request, res: Response): Promise<void> {
    const ownerUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCampaignCommand({
        ownerUserId,
        name: req.body.name,
        description: req.body.description,
        gameSystemId: req.body.gameSystemId,
        visibility: req.body.visibility,
        defaultLanguage: req.body.defaultLanguage,
        currentDateInWorld: req.body.currentDateInWorld,
        worldName: req.body.worldName,
        startingLevel: req.body.startingLevel,
      }),
    );

    res.status(201).json(result);
  }

  public async getCampaignDetails(req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetCampaignDetailsQuery({
        campaignId: this.getCampaignId(req),
        userId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        name: req.body.name,
        description: req.body.description,
        gameSystemId: req.body.gameSystemId,
        visibility: req.body.visibility,
        defaultLanguage: req.body.defaultLanguage,
        currentDateInWorld: req.body.currentDateInWorld,
        worldName: req.body.worldName,
        startingLevel: req.body.startingLevel,
      }),
    );

    res.status(200).json(result);
  }

  public async createCampaignCoverImageUpload(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCampaignCoverImageUploadCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        fileName: req.body.fileName,
        contentType: req.body.contentType,
      }),
    );

    res.status(201).json(result);
  }

  public async listCampaignCharacters(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignCharactersQuery({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateCharacterCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        ownerUserId: req.body.ownerUserId,
        sheetTemplateId: req.body.sheetTemplateId,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
        type: req.body.type,
        status: req.body.status,
        race: req.body.race,
        characterClass: req.body.characterClass,
        subclass: req.body.subclass,
        level: req.body.level,
        background: req.body.background,
        alignment: req.body.alignment,
        experiencePoints: req.body.experiencePoints,
        armorClass: req.body.armorClass,
        initiativeBonus: req.body.initiativeBonus,
        speed: req.body.speed,
        maxHitPoints: req.body.maxHitPoints,
        currentHitPoints: req.body.currentHitPoints,
        temporaryHitPoints: req.body.temporaryHitPoints,
        hitDice: req.body.hitDice,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma,
        proficiencyBonus: req.body.proficiencyBonus,
        savingThrows: req.body.savingThrows,
        skills: req.body.skills,
        proficiencies: req.body.proficiencies,
        languages: req.body.languages,
        attacksAndSpellcasting: req.body.attacksAndSpellcasting,
        spellcasting: req.body.spellcasting,
        featuresAndTraits: req.body.featuresAndTraits,
        personalityTraits: req.body.personalityTraits,
        ideals: req.body.ideals,
        bonds: req.body.bonds,
        flaws: req.body.flaws,
        backstory: req.body.backstory,
        appearance: req.body.appearance,
        customData: req.body.customData,
      }),
    );

    res.status(201).json(result);
  }

  public async getCharacterDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetCharacterDetailsQuery({
        campaignId: this.getCampaignId(req),
        characterId: this.getCharacterId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateCharacterCommand({
        campaignId: this.getCampaignId(req),
        characterId: this.getCharacterId(req),
        actorUserId,
        ownerUserId: req.body.ownerUserId,
        sheetTemplateId: req.body.sheetTemplateId,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
        type: req.body.type,
        status: req.body.status,
        race: req.body.race,
        characterClass: req.body.characterClass,
        subclass: req.body.subclass,
        level: req.body.level,
        background: req.body.background,
        alignment: req.body.alignment,
        experiencePoints: req.body.experiencePoints,
        armorClass: req.body.armorClass,
        initiativeBonus: req.body.initiativeBonus,
        speed: req.body.speed,
        maxHitPoints: req.body.maxHitPoints,
        currentHitPoints: req.body.currentHitPoints,
        temporaryHitPoints: req.body.temporaryHitPoints,
        hitDice: req.body.hitDice,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma,
        proficiencyBonus: req.body.proficiencyBonus,
        savingThrows: req.body.savingThrows,
        skills: req.body.skills,
        proficiencies: req.body.proficiencies,
        languages: req.body.languages,
        attacksAndSpellcasting: req.body.attacksAndSpellcasting,
        spellcasting: req.body.spellcasting,
        featuresAndTraits: req.body.featuresAndTraits,
        personalityTraits: req.body.personalityTraits,
        ideals: req.body.ideals,
        bonds: req.body.bonds,
        flaws: req.body.flaws,
        backstory: req.body.backstory,
        appearance: req.body.appearance,
        customData: req.body.customData,
      }),
    );

    res.status(200).json(result);
  }

  public async deleteCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteCharacterCommand({
        campaignId: this.getCampaignId(req),
        characterId: this.getCharacterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async archiveCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveCharacterCommand({
        campaignId: this.getCampaignId(req),
        characterId: this.getCharacterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async listCampaignMembers(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignMembersQuery({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async inviteCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new InviteCampaignMemberCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        userId: req.body.userId,
        role: req.body.role,
      }),
    );

    res.status(201).json(result);
  }

  public async updateCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    if (req.body.role === "OWNER") {
      await this.commandBus.execute(
        new TransferCampaignOwnershipCommand({
          campaignId: this.getCampaignId(req),
          actorUserId,
          memberId: this.getMemberId(req),
        }),
      );

      res.status(204).send();
      return;
    }

    await this.commandBus.execute(
      new ChangeCampaignMemberRoleCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        memberId: this.getMemberId(req),
        role: req.body.role,
      }),
    );

    res.status(204).send();
  }

  public async removeCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new RemoveCampaignMemberCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        memberId: this.getMemberId(req),
      }),
    );

    res.status(204).send();
  }

  public async listCampaignInvitations(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignInvitationsQuery({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async acceptCampaignInvitation(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new AcceptCampaignInvitationCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        invitationId: this.getInvitationId(req),
      }),
    );

    res.status(204).send();
  }

  public async declineCampaignInvitation(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new DeclineCampaignInvitationCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
        invitationId: this.getInvitationId(req),
      }),
    );

    res.status(204).send();
  }

  public async archiveCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async restoreCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new RestoreCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async deleteCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteCampaignCommand({
        campaignId: this.getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  private getAuthUserId(res: Response): string {
    const userId = res.locals.authUserId as string | undefined;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    return userId;
  }

  private getCampaignId(req: Request): string {
    const campaignId = req.params.campaignId;

    if (typeof campaignId !== "string" || campaignId.trim().length === 0) {
      throw new ValidationError("Campaign id is required");
    }

    return campaignId;
  }

  private getMemberId(req: Request): string {
    const memberId = req.params.memberId;

    if (typeof memberId !== "string" || memberId.trim().length === 0) {
      throw new ValidationError("Campaign member id is required");
    }

    return memberId;
  }

  private getInvitationId(req: Request): string {
    const invitationId = req.params.invitationId;

    if (typeof invitationId !== "string" || invitationId.trim().length === 0) {
      throw new ValidationError("Campaign invitation id is required");
    }

    return invitationId;
  }

  private getCharacterId(req: Request): string {
    const characterId = req.params.characterId;

    if (typeof characterId !== "string" || characterId.trim().length === 0) {
      throw new ValidationError("Character id is required");
    }

    return characterId;
  }
}
