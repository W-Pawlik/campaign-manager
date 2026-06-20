import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { AcceptCampaignInvitationCommand } from "@modules/campaigns/application/commands/AcceptCampaignInvitationCommand";
import { ChangeCampaignMemberRoleCommand } from "@modules/campaigns/application/commands/ChangeCampaignMemberRoleCommand";
import { DeclineCampaignInvitationCommand } from "@modules/campaigns/application/commands/DeclineCampaignInvitationCommand";
import { InviteCampaignMemberCommand } from "@modules/campaigns/application/commands/InviteCampaignMemberCommand";
import { RemoveCampaignMemberCommand } from "@modules/campaigns/application/commands/RemoveCampaignMemberCommand";
import { TransferCampaignOwnershipCommand } from "@modules/campaigns/application/commands/TransferCampaignOwnershipCommand";
import { ListCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCampaignInvitationsQuery";
import { ListCampaignMembersQuery } from "@modules/campaigns/application/queries/ListCampaignMembersQuery";
import {
  getAuthUserId,
  getCampaignId,
  getInvitationId,
  getMemberId,
} from "@api/controllers/campaigns.controller.helpers";

export class CampaignMembersController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignMembers(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignMembersQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async inviteCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new InviteCampaignMemberCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        userId: req.body.userId,
        role: req.body.role,
      }),
    );

    res.status(201).json(result);
  }

  public async updateCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    if (req.body.role === "OWNER") {
      await this.commandBus.execute(
        new TransferCampaignOwnershipCommand({
          campaignId: getCampaignId(req),
          actorUserId,
          memberId: getMemberId(req),
        }),
      );

      res.status(204).send();
      return;
    }

    await this.commandBus.execute(
      new ChangeCampaignMemberRoleCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        memberId: getMemberId(req),
        role: req.body.role,
      }),
    );

    res.status(204).send();
  }

  public async removeCampaignMember(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new RemoveCampaignMemberCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        memberId: getMemberId(req),
      }),
    );

    res.status(204).send();
  }

  public async listCampaignInvitations(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignInvitationsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async acceptCampaignInvitation(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new AcceptCampaignInvitationCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        invitationId: getInvitationId(req),
      }),
    );

    res.status(204).send();
  }

  public async declineCampaignInvitation(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeclineCampaignInvitationCommand({
        campaignId: getCampaignId(req),
        actorUserId,
        invitationId: getInvitationId(req),
      }),
    );

    res.status(204).send();
  }
}
