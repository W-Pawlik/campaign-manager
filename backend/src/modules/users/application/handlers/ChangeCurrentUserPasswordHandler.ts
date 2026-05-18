import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { ChangeCurrentUserPasswordCommand } from "@modules/users/application/commands/ChangeCurrentUserPasswordCommand";
import type { PasswordHasher } from "@modules/users/application/ports/PasswordHasher";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";

export class ChangeCurrentUserPasswordHandler
  implements CommandHandler<ChangeCurrentUserPasswordCommand, void>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async execute(command: ChangeCurrentUserPasswordCommand): Promise<void> {
    const user = await this.userRepository.findById(command.input.userId);

    if (user === null) {
      throw new NotFoundError("User not found");
    }

    user.ensureIsActive();

    const isCurrentPasswordValid = await this.passwordHasher.verify(
      command.input.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new ForbiddenError("Current password is invalid");
    }

    if (command.input.newPassword.length < 8 || command.input.newPassword.length > 128) {
      throw new ValidationError("New password must be between 8 and 128 characters");
    }

    const newPasswordHash = await this.passwordHasher.hash(command.input.newPassword);
    const userWithUpdatedPassword = user.withPasswordHash(newPasswordHash);

    await this.userRepository.save(userWithUpdatedPassword);
  }
}
