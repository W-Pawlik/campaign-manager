import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { DeleteChronicleEntryCommand } from "@modules/chronicle/application/commands/DeleteChronicleEntryCommand";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import type { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";

export class DeleteChronicleEntryHandler implements CommandHandler<DeleteChronicleEntryCommand, void> {
  public constructor(
    private readonly chronicleRepository: ChronicleEntryRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: ChroniclePermissionDomainService,
  ) {}

  public async execute(command: DeleteChronicleEntryCommand): Promise<void> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHRONICLE_DELETE,
    );
    const entry = await this.chronicleRepository.findById(command.input.campaignId, command.input.entryId);

    if (entry === null) {
      throw new NotFoundError("Chronicle entry not found");
    }

    if (!this.permissionService.canManageEntry(access.role, command.input.actorUserId, entry)) {
      throw new ForbiddenError("Insufficient chronicle entry permissions");
    }

    await this.chronicleRepository.delete(command.input.campaignId, command.input.entryId);
  }
}
