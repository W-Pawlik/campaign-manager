import type { Request, Response } from "express";
import { getAuthUserId } from "@api/controllers/campaigns.controller.helpers";
import {
  getExternalResourceKey,
  getExternalResourceType,
} from "@api/controllers/external.controller.helpers";
import { mapSearchExternalResourcesQueryInput } from "@api/mappers/ExternalOpen5eQueryRequestMapper";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { SearchExternalResourcesQuery } from "@modules/external-references/application/queries/SearchExternalResourcesQuery";

export class ExternalOpen5eController {
  public constructor(private readonly queryBus: QueryBus) {}

  public async search(req: Request, res: Response): Promise<void> {
    void getAuthUserId(res);
    const result = await this.queryBus.execute(
      new SearchExternalResourcesQuery(
        mapSearchExternalResourcesQueryInput(req.query),
      ),
    );

    res.status(200).json(result);
  }

  public async getResourceDetails(req: Request, res: Response): Promise<void> {
    void getAuthUserId(res);
    const result = await this.queryBus.execute(
      new GetExternalResourceDetailsQuery({
        provider: "OPEN5E",
        resourceType: getExternalResourceType(req),
        key: getExternalResourceKey(req),
      }),
    );

    res.status(200).json(result);
  }
}
