import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { PublishChronicleEntryCommand } from "@modules/chronicle/application/commands/PublishChronicleEntryCommand";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import type { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";

export class PublishChronicleEntryHandler
  implements CommandHandler<PublishChronicleEntryCommand, ChronicleEntryDTO>
{
  public constructor(
    private readonly chronicleRepository: ChronicleEntryRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: ChroniclePermissionDomainService,
  ) {}

  public async execute(command: PublishChronicleEntryCommand): Promise<ChronicleEntryDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHRONICLE_PUBLISH,
    );
    const entry = await this.chronicleRepository.findById(command.input.campaignId, command.input.entryId);

    if (entry === null) {
      throw new NotFoundError("Chronicle entry not found");
    }

    if (!this.permissionService.canManageEntry(access.role, command.input.actorUserId, entry)) {
      throw new ForbiddenError("Insufficient chronicle entry permissions");
    }

    const publishedEntry = entry.publish(new Date());
    await this.chronicleRepository.save(publishedEntry);

    return mapChronicleEntryDtoFromDomain(publishedEntry);
  }
}
