import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { DeleteCurrentUserAccountCommand } from "@modules/users/application/commands/DeleteCurrentUserAccountCommand";
import type { UserCampaignOwnershipChecker } from "@modules/users/application/ports/UserCampaignOwnershipChecker";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";

export class DeleteCurrentUserAccountHandler
  implements CommandHandler<DeleteCurrentUserAccountCommand, void>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly ownershipChecker: UserCampaignOwnershipChecker,
  ) {}

  public async execute(command: DeleteCurrentUserAccountCommand): Promise<void> {
    const user = await this.userRepository.findById(command.input.userId);

    if (user === null) {
      throw new NotFoundError("User not found");
    }

    user.ensureIsActive();

    const hasActiveOwnedCampaigns = await this.ownershipChecker.hasActiveOwnedCampaigns(user.id);

    if (hasActiveOwnedCampaigns) {
      throw new ForbiddenError(
        "User owns active campaigns and cannot be deleted before ownership transfer or archive",
      );
    }

    const deletedAt = new Date();
    await this.userRepository.softDelete(user.id, deletedAt);
  }
}
