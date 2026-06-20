import type { Request, Response } from "express";
import { mapCreateCharacterCommandInput, mapUpdateCharacterCommandInput } from "@api/mappers/CharacterCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ArchiveCharacterCommand } from "@modules/characters/application/commands/ArchiveCharacterCommand";
import { CreateCharacterCommand } from "@modules/characters/application/commands/CreateCharacterCommand";
import { DeleteCharacterCommand } from "@modules/characters/application/commands/DeleteCharacterCommand";
import { UpdateCharacterCommand } from "@modules/characters/application/commands/UpdateCharacterCommand";
import { GetCharacterDetailsQuery } from "@modules/characters/application/queries/GetCharacterDetailsQuery";
import { ListCampaignCharactersQuery } from "@modules/characters/application/queries/ListCampaignCharactersQuery";
import { getAuthUserId, getCampaignId, getCharacterId } from "@api/controllers/campaigns.controller.helpers";

export class CampaignCharactersController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignCharacters(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignCharactersQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateCharacterCommand(
        mapCreateCharacterCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getCharacterDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const characterId = getCharacterId(req);
    const result = await this.queryBus.execute(
      new GetCharacterDetailsQuery({
        campaignId,
        characterId,
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const characterId = getCharacterId(req);
    const result = await this.commandBus.execute(
      new UpdateCharacterCommand(
        mapUpdateCharacterCommandInput({
          campaignId,
          characterId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteCharacterCommand({
        campaignId: getCampaignId(req),
        characterId: getCharacterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async archiveCharacter(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new ArchiveCharacterCommand({
        campaignId: getCampaignId(req),
        characterId: getCharacterId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
