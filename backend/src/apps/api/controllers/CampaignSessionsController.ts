import type { Request, Response } from "express";
import { mapCreateSessionCommandInput, mapUpdateSessionCommandInput } from "@api/mappers/SessionCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CancelSessionCommand } from "@modules/sessions/application/commands/CancelSessionCommand";
import { CompleteSessionCommand } from "@modules/sessions/application/commands/CompleteSessionCommand";
import { ConfirmSessionAttendanceCommand } from "@modules/sessions/application/commands/ConfirmSessionAttendanceCommand";
import { CreateSessionCommand } from "@modules/sessions/application/commands/CreateSessionCommand";
import { DeclineSessionAttendanceCommand } from "@modules/sessions/application/commands/DeclineSessionAttendanceCommand";
import { UpdateSessionCommand } from "@modules/sessions/application/commands/UpdateSessionCommand";
import { GetSessionDetailsQuery } from "@modules/sessions/application/queries/GetSessionDetailsQuery";
import { ListCampaignSessionsQuery } from "@modules/sessions/application/queries/ListCampaignSessionsQuery";
import { getAuthUserId, getCampaignId, getSessionId } from "@api/controllers/campaigns.controller.helpers";

export class CampaignSessionsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignSessions(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignSessionsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createSession(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateSessionCommand(
        mapCreateSessionCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getSessionDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetSessionDetailsQuery({
        campaignId: getCampaignId(req),
        sessionId: getSessionId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateSession(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const sessionId = getSessionId(req);
    const result = await this.commandBus.execute(
      new UpdateSessionCommand(
        mapUpdateSessionCommandInput({
          campaignId,
          sessionId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async cancelSession(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new CancelSessionCommand({
        campaignId: getCampaignId(req),
        sessionId: getSessionId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async confirmAttendance(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new ConfirmSessionAttendanceCommand({
        campaignId: getCampaignId(req),
        sessionId: getSessionId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async declineAttendance(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new DeclineSessionAttendanceCommand({
        campaignId: getCampaignId(req),
        sessionId: getSessionId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async completeSession(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CompleteSessionCommand({
        campaignId: getCampaignId(req),
        sessionId: getSessionId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }
}
