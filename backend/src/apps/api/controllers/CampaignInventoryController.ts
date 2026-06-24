import type { Request, Response } from "express";
import {
  getAuthUserId,
  getCampaignId,
  getInventoryItemId,
} from "@api/controllers/campaigns.controller.helpers";
import {
  mapCreateInventoryItemCommandInput,
  mapTransferInventoryItemCommandInput,
  mapUpdateInventoryItemCommandInput,
} from "@api/mappers/InventoryCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateInventoryItemCommand } from "@modules/items/application/commands/CreateInventoryItemCommand";
import { DeleteInventoryItemCommand } from "@modules/items/application/commands/DeleteInventoryItemCommand";
import { TransferInventoryItemCommand } from "@modules/items/application/commands/TransferInventoryItemCommand";
import { UpdateInventoryItemCommand } from "@modules/items/application/commands/UpdateInventoryItemCommand";
import { GetInventoryItemDetailsQuery } from "@modules/items/application/queries/GetInventoryItemDetailsQuery";
import { ListCampaignInventoryQuery } from "@modules/items/application/queries/ListCampaignInventoryQuery";
import { ListMyInventoryItemsQuery } from "@modules/items/application/queries/ListMyInventoryItemsQuery";

export class CampaignInventoryController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignInventory(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignInventoryQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createInventoryItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateInventoryItemCommand(
        mapCreateInventoryItemCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async listMyInventoryItems(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListMyInventoryItemsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async getInventoryItemDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetInventoryItemDetailsQuery({
        campaignId: getCampaignId(req),
        itemId: getInventoryItemId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateInventoryItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const itemId = getInventoryItemId(req);
    const result = await this.commandBus.execute(
      new UpdateInventoryItemCommand(
        mapUpdateInventoryItemCommandInput({
          campaignId,
          itemId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteInventoryItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteInventoryItemCommand({
        campaignId: getCampaignId(req),
        itemId: getInventoryItemId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }

  public async transferInventoryItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const itemId = getInventoryItemId(req);
    const result = await this.commandBus.execute(
      new TransferInventoryItemCommand(
        mapTransferInventoryItemCommandInput({
          campaignId,
          itemId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }
}
