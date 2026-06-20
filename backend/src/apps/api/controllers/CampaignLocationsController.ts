import type { Request, Response } from "express";
import { getAuthUserId, getCampaignId, getLocationId } from "@api/controllers/campaigns.controller.helpers";
import { mapCreateLocationCommandInput, mapUpdateLocationCommandInput } from "@api/mappers/LocationCommandRequestMapper";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { CreateLocationCommand } from "@modules/locations/application/commands/CreateLocationCommand";
import { DeleteLocationCommand } from "@modules/locations/application/commands/DeleteLocationCommand";
import { UpdateLocationCommand } from "@modules/locations/application/commands/UpdateLocationCommand";
import { GetLocationDetailsQuery } from "@modules/locations/application/queries/GetLocationDetailsQuery";
import { ListCampaignLocationsQuery } from "@modules/locations/application/queries/ListCampaignLocationsQuery";

export class CampaignLocationsController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async listCampaignLocations(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const result = await this.queryBus.execute(
      new ListCampaignLocationsQuery({
        campaignId: getCampaignId(req),
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async createLocation(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const result = await this.commandBus.execute(
      new CreateLocationCommand(
        mapCreateLocationCommandInput({
          campaignId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(201).json(result);
  }

  public async getLocationDetails(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const locationId = getLocationId(req);
    const result = await this.queryBus.execute(
      new GetLocationDetailsQuery({
        campaignId,
        locationId,
        actorUserId,
      }),
    );

    res.status(200).json(result);
  }

  public async updateLocation(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);
    const campaignId = getCampaignId(req);
    const locationId = getLocationId(req);
    const result = await this.commandBus.execute(
      new UpdateLocationCommand(
        mapUpdateLocationCommandInput({
          campaignId,
          locationId,
          actorUserId,
          body: req.body,
        }),
      ),
    );

    res.status(200).json(result);
  }

  public async deleteLocation(req: Request, res: Response): Promise<void> {
    const actorUserId = getAuthUserId(res);

    await this.commandBus.execute(
      new DeleteLocationCommand({
        campaignId: getCampaignId(req),
        locationId: getLocationId(req),
        actorUserId,
      }),
    );

    res.status(204).send();
  }
}
