import type { Request, Response } from "express";
import { getAuthUserId, getItemTemplateId } from "@api/controllers/campaigns.controller.helpers";
import { getExternalResourceKey } from "@api/controllers/external.controller.helpers";
import {
  mapCopyOpen5eItemToCampaignCommandInput,
  mapCopyPublishedItemToCampaignCommandInput,
  mapCreatePublishedItemCommandInput,
  mapUpdatePublishedItemCommandInput,
} from "@api/mappers/ItemCatalogCommandRequestMapper";
import {
  mapListOpen5eItemCatalogQueryInput,
  mapListPublishedItemsQueryInput,
} from "@api/mappers/ItemCatalogQueryRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateInventoryItemCommand } from "@modules/items/application/commands/CreateInventoryItemCommand";
import { CreateItemTemplateCommand } from "@modules/items/application/commands/CreateItemTemplateCommand";
import { ImportOpen5eItemToInventoryCommand } from "@modules/items/application/commands/ImportOpen5eItemToInventoryCommand";
import { UpdateItemTemplateCommand } from "@modules/items/application/commands/UpdateItemTemplateCommand";
import { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { ListOpen5eItemCatalogQuery } from "@modules/external-references/application/queries/ListOpen5eItemCatalogQuery";
import { GetPublishedItemTemplateDetailsQuery } from "@modules/items/application/queries/GetPublishedItemTemplateDetailsQuery";
import { ListPublishedItemTemplatesQuery } from "@modules/items/application/queries/ListPublishedItemTemplatesQuery";

export class ItemCatalogController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listOpen5eItems(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListOpen5eItemCatalogQuery(
        mapListOpen5eItemCatalogQueryInput({
          actorUserId,
          resourceType: "EQUIPMENT",
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async getOpen5eItemDetails(req: Request, res: Response): Promise<void> {
    void getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetExternalResourceDetailsQuery({
        provider: "OPEN5E",
        resourceType: "EQUIPMENT",
        key: getExternalResourceKey(req),
      }),
    );

    res.status(200).json(result);
  }

  public async copyOpen5eItemToCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new ImportOpen5eItemToInventoryCommand(
        mapCopyOpen5eItemToCampaignCommandInput({
          actorUserId,
          resourceType: "EQUIPMENT",
          resourceKey: getExternalResourceKey(req),
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async listOpen5eMagicItems(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListOpen5eItemCatalogQuery(
        mapListOpen5eItemCatalogQueryInput({
          actorUserId,
          resourceType: "MAGIC_ITEM",
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async getOpen5eMagicItemDetails(req: Request, res: Response): Promise<void> {
    void getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetExternalResourceDetailsQuery({
        provider: "OPEN5E",
        resourceType: "MAGIC_ITEM",
        key: getExternalResourceKey(req),
      }),
    );

    res.status(200).json(result);
  }

  public async copyOpen5eMagicItemToCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new ImportOpen5eItemToInventoryCommand(
        mapCopyOpen5eItemToCampaignCommandInput({
          actorUserId,
          resourceType: "MAGIC_ITEM",
          resourceKey: getExternalResourceKey(req),
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async listPublishedItems(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListPublishedItemTemplatesQuery(
        mapListPublishedItemsQueryInput({
          actorUserId,
          query: req.query,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async createPublishedItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateItemTemplateCommand(
        mapCreatePublishedItemCommandInput({
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getPublishedItemDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetPublishedItemTemplateDetailsQuery({
        actorUserId,
        itemTemplateId: getItemTemplateId(req),
      }),
    );

    res.status(200).json(result);
  }

  public async updatePublishedItem(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateItemTemplateCommand(
        mapUpdatePublishedItemCommandInput({
          actorUserId,
          itemTemplateId: getItemTemplateId(req),
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async copyPublishedItemToCampaign(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.commandBus.execute(
      new CreateInventoryItemCommand(
        mapCopyPublishedItemToCampaignCommandInput({
          actorUserId,
          itemTemplateId: getItemTemplateId(req),
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }
}
