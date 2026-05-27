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
}
