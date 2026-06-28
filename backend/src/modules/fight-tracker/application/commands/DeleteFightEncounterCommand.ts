import type { Command } from "@core/application/cqrs/Command";

export interface DeleteFightEncounterCommandInput {
  campaignId: string;
  encounterId: string;
  actorUserId: string;
}

export class DeleteFightEncounterCommand implements Command<void> {
  public constructor(public readonly input: DeleteFightEncounterCommandInput) {}
}
