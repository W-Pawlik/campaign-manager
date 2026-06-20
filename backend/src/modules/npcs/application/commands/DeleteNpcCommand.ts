import type { Command } from "@core/application/cqrs/Command";

export interface DeleteNpcInput {
  campaignId: string;
  npcId: string;
  actorUserId: string;
}

export class DeleteNpcCommand implements Command<void> {
  public constructor(public readonly input: DeleteNpcInput) {}
}
