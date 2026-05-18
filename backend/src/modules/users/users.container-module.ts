import type { Container } from "inversify";
import type { PrismaClient } from "@prisma/client";
import type { PasswordHasher } from "@modules/users/application/ports/PasswordHasher";
import type { UserCampaignOwnershipChecker } from "@modules/users/application/ports/UserCampaignOwnershipChecker";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { ChangeCurrentUserPasswordHandler } from "@modules/users/application/handlers/ChangeCurrentUserPasswordHandler";
import { DeleteCurrentUserAccountHandler } from "@modules/users/application/handlers/DeleteCurrentUserAccountHandler";
import { GetCurrentUserProfileHandler } from "@modules/users/application/handlers/GetCurrentUserProfileHandler";
import { UpdateCurrentUserProfileHandler } from "@modules/users/application/handlers/UpdateCurrentUserProfileHandler";
import { NoopUserCampaignOwnershipChecker } from "@modules/users/infrastructure/persistence/NoopUserCampaignOwnershipChecker";
import { PrismaUserProfileRepository } from "@modules/users/infrastructure/persistence/PrismaUserProfileRepository";
import { PrismaUserRepository } from "@modules/users/infrastructure/persistence/PrismaUserRepository";
import { UserMapper } from "@modules/users/infrastructure/persistence/UserMapper";
import { UserProfileMapper } from "@modules/users/infrastructure/persistence/UserProfileMapper";
import { USERS_TYPES } from "@modules/users/users.types";
import { CORE_TYPES } from "@core/di/core.types";
import { AUTH_TYPES } from "@modules/auth/auth.types";

export function loadUsersContainerModule(container: Container): void {
  container.bind<UserMapper>(USERS_TYPES.UserMapper).toDynamicValue(() => new UserMapper()).inSingletonScope();
  container
    .bind<UserProfileMapper>(USERS_TYPES.UserProfileMapper)
    .toDynamicValue(() => new UserProfileMapper())
    .inSingletonScope();

  container
    .bind<UserRepository>(USERS_TYPES.UserRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const userMapper = context.get<UserMapper>(USERS_TYPES.UserMapper);

      return new PrismaUserRepository(prismaClient, userMapper);
    })
    .inSingletonScope();

  container
    .bind<UserProfileRepository>(USERS_TYPES.UserProfileRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const userProfileMapper = context.get<UserProfileMapper>(USERS_TYPES.UserProfileMapper);

      return new PrismaUserProfileRepository(prismaClient, userProfileMapper);
    })
    .inSingletonScope();

  container
    .bind<UserCampaignOwnershipChecker>(USERS_TYPES.UserCampaignOwnershipChecker)
    .toDynamicValue(() => new NoopUserCampaignOwnershipChecker())
    .inSingletonScope();

  container
    .bind<GetCurrentUserProfileHandler>(USERS_TYPES.GetCurrentUserProfileHandler)
    .toDynamicValue((context) => {
      const userRepository = context.get<UserRepository>(USERS_TYPES.UserRepository);
      const userProfileRepository = context.get<UserProfileRepository>(USERS_TYPES.UserProfileRepository);

      return new GetCurrentUserProfileHandler(userRepository, userProfileRepository);
    })
    .inTransientScope();

  container
    .bind<UpdateCurrentUserProfileHandler>(USERS_TYPES.UpdateCurrentUserProfileHandler)
    .toDynamicValue((context) => {
      const userRepository = context.get<UserRepository>(USERS_TYPES.UserRepository);
      const userProfileRepository = context.get<UserProfileRepository>(USERS_TYPES.UserProfileRepository);

      return new UpdateCurrentUserProfileHandler(userRepository, userProfileRepository);
    })
    .inTransientScope();

  container
    .bind<ChangeCurrentUserPasswordHandler>(USERS_TYPES.ChangeCurrentUserPasswordHandler)
    .toDynamicValue((context) => {
      const userRepository = context.get<UserRepository>(USERS_TYPES.UserRepository);
      const passwordHasher = context.get<PasswordHasher>(AUTH_TYPES.PasswordHasher);

      return new ChangeCurrentUserPasswordHandler(userRepository, passwordHasher);
    })
    .inTransientScope();

  container
    .bind<DeleteCurrentUserAccountHandler>(USERS_TYPES.DeleteCurrentUserAccountHandler)
    .toDynamicValue((context) => {
      const userRepository = context.get<UserRepository>(USERS_TYPES.UserRepository);
      const ownershipChecker = context.get<UserCampaignOwnershipChecker>(
        USERS_TYPES.UserCampaignOwnershipChecker,
      );

      return new DeleteCurrentUserAccountHandler(userRepository, ownershipChecker);
    })
    .inTransientScope();
}
