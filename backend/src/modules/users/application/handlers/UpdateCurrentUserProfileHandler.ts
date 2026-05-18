import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ConflictError, NotFoundError } from "@core/application/errors/AppError";
import type { CurrentUserProfileDTO } from "@modules/users/application/dto/CurrentUserProfileDTO";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import type { UpdateCurrentUserProfileCommand } from "@modules/users/application/commands/UpdateCurrentUserProfileCommand";
import { mapCurrentUserProfileDTO } from "@modules/users/application/services/CurrentUserProfileDtoMapper";
import { UserProfile } from "@modules/users/domain/entities/UserProfile";
import { DisplayName } from "@modules/users/domain/value-objects/DisplayName";
import { Username } from "@modules/users/domain/value-objects/Username";

export class UpdateCurrentUserProfileHandler
  implements CommandHandler<UpdateCurrentUserProfileCommand, CurrentUserProfileDTO>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  public async execute(command: UpdateCurrentUserProfileCommand): Promise<CurrentUserProfileDTO> {
    const user = await this.userRepository.findById(command.input.userId);

    if (user === null) {
      throw new NotFoundError("User not found");
    }

    user.ensureIsActive();

    const username =
      command.input.username === undefined ? undefined : Username.create(command.input.username);

    if (username !== undefined) {
      const existingUser = await this.userRepository.findByUsername(username);

      if (existingUser !== null && existingUser.id !== user.id) {
        throw new ConflictError("Username is already taken");
      }
    }

    const displayName =
      command.input.displayName === undefined
        ? undefined
        : DisplayName.create(command.input.displayName);
    const updatedUser = user.withUpdatedDetails({
      ...(username === undefined ? {} : { username }),
      ...(displayName === undefined ? {} : { displayName }),
      ...(command.input.avatarUrl === undefined ? {} : { avatarUrl: command.input.avatarUrl }),
      ...(command.input.bio === undefined ? {} : { bio: command.input.bio }),
      ...(command.input.timezone === undefined ? {} : { timezone: command.input.timezone }),
      ...(command.input.locale === undefined ? {} : { locale: command.input.locale }),
    });

    await this.userRepository.save(updatedUser);

    let updatedProfile = await this.userProfileRepository.findByUserId(user.id);

    if (command.input.profile !== undefined) {
      if (updatedProfile === null) {
        updatedProfile = UserProfile.create({
          id: randomUUID(),
          userId: user.id,
          preferredSystem: command.input.profile.preferredSystem ?? null,
          defaultTimezone: command.input.profile.defaultTimezone ?? null,
          socialLinks: command.input.profile.socialLinks ?? null,
          settings: command.input.profile.settings ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        updatedProfile = updatedProfile.withUpdates({
          ...(command.input.profile.preferredSystem === undefined
            ? {}
            : { preferredSystem: command.input.profile.preferredSystem }),
          ...(command.input.profile.defaultTimezone === undefined
            ? {}
            : { defaultTimezone: command.input.profile.defaultTimezone }),
          ...(command.input.profile.socialLinks === undefined
            ? {}
            : { socialLinks: command.input.profile.socialLinks }),
          ...(command.input.profile.settings === undefined
            ? {}
            : { settings: command.input.profile.settings }),
        });
      }

      await this.userProfileRepository.save(updatedProfile);
    }

    return mapCurrentUserProfileDTO(updatedUser, updatedProfile);
  }
}
