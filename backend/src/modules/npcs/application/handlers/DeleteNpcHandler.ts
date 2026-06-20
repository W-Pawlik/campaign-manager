import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { DeleteNpcCommand } from "@modules/npcs/application/commands/DeleteNpcCommand";
import type { NpcRepository } from "@modules/npcs/application/ports/NpcRepository";

export class DeleteNpcHandler implements CommandHandler<DeleteNpcCommand, void> {
  public constructor(
    private readonly npcRepository: NpcRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: DeleteNpcCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.NPC_UPDATE,
    );
    const npc = await this.npcRepository.findById(command.input.campaignId, command.input.npcId);

    if (npc === null) {
      throw new NotFoundError("NPC not found");
    }

    await this.npcRepository.save(npc.softDelete(new Date()));
  }
}
