import type { Container } from "inversify";
import type { PrismaClient } from "@prisma/client";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { TokenService } from "@modules/auth/application/ports/TokenService";
import { RegisterUserHandler } from "@modules/auth/application/handlers/RegisterUserHandler";
import { LoginUserHandler } from "@modules/auth/application/handlers/LoginUserHandler";
import { RefreshTokenHandler } from "@modules/auth/application/handlers/RefreshTokenHandler";
import { LogoutHandler } from "@modules/auth/application/handlers/LogoutHandler";
import { GetCurrentUserHandler } from "@modules/auth/application/handlers/GetCurrentUserHandler";
import { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { PrismaAuthRepository } from "@modules/auth/infrastructure/persistence/PrismaAuthRepository";
import { PrismaUserSessionRepository } from "@modules/auth/infrastructure/persistence/PrismaUserSessionRepository";
import { ScryptPasswordHasher } from "@modules/auth/infrastructure/security/ScryptPasswordHasher";
import { JwtTokenService } from "@modules/auth/infrastructure/security/JwtTokenService";
import { AUTH_TYPES } from "@modules/auth/auth.types";
import { CORE_TYPES } from "@core/di/core.types";

export function loadAuthContainerModule(container: Container): void {
  container
    .bind<AuthRepository>(AUTH_TYPES.AuthRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaAuthRepository(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<UserSessionRepository>(AUTH_TYPES.UserSessionRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);

      return new PrismaUserSessionRepository(prismaClient);
    })
    .inSingletonScope();

  container
    .bind<PasswordHasher>(AUTH_TYPES.PasswordHasher)
    .toDynamicValue(() => new ScryptPasswordHasher())
    .inSingletonScope();

  container
    .bind<TokenService>(AUTH_TYPES.TokenService)
    .toDynamicValue(() => new JwtTokenService())
    .inSingletonScope();

  container
    .bind<AuthTokensIssuer>(AUTH_TYPES.AuthTokensIssuer)
    .toDynamicValue((context) => {
      const tokenService = context.get<TokenService>(AUTH_TYPES.TokenService);
      const passwordHasher = context.get<PasswordHasher>(AUTH_TYPES.PasswordHasher);
      const userSessionRepository = context.get<UserSessionRepository>(AUTH_TYPES.UserSessionRepository);

      return new AuthTokensIssuer(tokenService, passwordHasher, userSessionRepository);
    })
    .inTransientScope();

  container
    .bind<RegisterUserHandler>(AUTH_TYPES.RegisterUserHandler)
    .toDynamicValue((context) => {
      const authRepository = context.get<AuthRepository>(AUTH_TYPES.AuthRepository);
      const passwordHasher = context.get<PasswordHasher>(AUTH_TYPES.PasswordHasher);
      const authTokensIssuer = context.get<AuthTokensIssuer>(AUTH_TYPES.AuthTokensIssuer);

      return new RegisterUserHandler(authRepository, passwordHasher, authTokensIssuer);
    })
    .inTransientScope();

  container
    .bind<LoginUserHandler>(AUTH_TYPES.LoginUserHandler)
    .toDynamicValue((context) => {
      const authRepository = context.get<AuthRepository>(AUTH_TYPES.AuthRepository);
      const passwordHasher = context.get<PasswordHasher>(AUTH_TYPES.PasswordHasher);
      const authTokensIssuer = context.get<AuthTokensIssuer>(AUTH_TYPES.AuthTokensIssuer);

      return new LoginUserHandler(authRepository, passwordHasher, authTokensIssuer);
    })
    .inTransientScope();

  container
    .bind<RefreshTokenHandler>(AUTH_TYPES.RefreshTokenHandler)
    .toDynamicValue((context) => {
      const authRepository = context.get<AuthRepository>(AUTH_TYPES.AuthRepository);
      const userSessionRepository = context.get<UserSessionRepository>(AUTH_TYPES.UserSessionRepository);
      const tokenService = context.get<TokenService>(AUTH_TYPES.TokenService);
      const passwordHasher = context.get<PasswordHasher>(AUTH_TYPES.PasswordHasher);
      const authTokensIssuer = context.get<AuthTokensIssuer>(AUTH_TYPES.AuthTokensIssuer);

      return new RefreshTokenHandler(
        authRepository,
        userSessionRepository,
        tokenService,
        passwordHasher,
        authTokensIssuer,
      );
    })
    .inTransientScope();

  container
    .bind<LogoutHandler>(AUTH_TYPES.LogoutHandler)
    .toDynamicValue((context) => {
      const userSessionRepository = context.get<UserSessionRepository>(AUTH_TYPES.UserSessionRepository);
      const tokenService = context.get<TokenService>(AUTH_TYPES.TokenService);

      return new LogoutHandler(userSessionRepository, tokenService);
    })
    .inTransientScope();

  container
    .bind<GetCurrentUserHandler>(AUTH_TYPES.GetCurrentUserHandler)
    .toDynamicValue((context) => {
      const authRepository = context.get<AuthRepository>(AUTH_TYPES.AuthRepository);

      return new GetCurrentUserHandler(authRepository);
    })
    .inTransientScope();
}
