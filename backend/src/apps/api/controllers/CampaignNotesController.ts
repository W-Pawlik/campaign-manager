import type { Request, Response } from "express";
import { getAuthUserId, getCampaignId, getNoteId } from "@api/controllers/campaigns.controller.helpers";
import { mapCreateNoteCommandInput, mapUpdateNoteCommandInput } from "@api/mappers/NoteCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateNoteCommand } from "@modules/notes/application/commands/CreateNoteCommand";
import { DeleteNoteCommand } from "@modules/notes/application/commands/DeleteNoteCommand";
import { UpdateNoteCommand } from "@modules/notes/application/commands/UpdateNoteCommand";
import { GetNoteDetailsQuery } from "@modules/notes/application/queries/GetNoteDetailsQuery";
import { ListCampaignNotesQuery } from "@modules/notes/application/queries/ListCampaignNotesQuery";

export class CampaignNotesController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignNotes(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignNotesQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createNote(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateNoteCommand(
        mapCreateNoteCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getNoteDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const noteId = getNoteId(req);
    const result = await this.queryBus.execute(
      new GetNoteDetailsQuery({
        campaignId,
        noteId,
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateNote(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const noteId = getNoteId(req);
    const result = await this.commandBus.execute(
      new UpdateNoteCommand(
        mapUpdateNoteCommandInput({
          campaignId,
          noteId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteNote(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteNoteCommand({
        campaignId: getCampaignId(req),
        noteId: getNoteId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
