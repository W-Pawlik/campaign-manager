import type { Command } from "@core/application/cqrs/Command";

export interface DeleteLocationInput {
  campaignId: string;
  locationId: string;
  actorUserId: string;
}

export class DeleteLocationCommand implements Command<void> {
  public constructor(public readonly input: DeleteLocationInput) {}
}
