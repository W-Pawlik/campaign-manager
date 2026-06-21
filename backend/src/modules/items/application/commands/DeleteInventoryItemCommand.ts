import type { Command } from "@core/application/cqrs/Command";

export interface DeleteInventoryItemInput {
  campaignId: string;
  itemId: string;
  actorUserId: string;
}

export class DeleteInventoryItemCommand implements Command<void> {
  public constructor(public readonly input: DeleteInventoryItemInput) {}
}
