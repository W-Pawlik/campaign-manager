import { randomUUID } from "node:crypto";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { TokenService } from "@modules/auth/application/ports/TokenService";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import type { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";

export class AuthTokensIssuer {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly passwordHasher: PasswordHasher,
    private readonly userSessionRepository: UserSessionRepository,
  ) {}

  public async issueForUser(userCredentials: UserCredentials): Promise<AuthTokensDTO> {
    const accessToken = this.tokenService.issueAccessToken({
      userId: userCredentials.id,
      email: userCredentials.email.value,
    });

    const sessionId = randomUUID();
    const issuedRefreshToken = this.tokenService.issueRefreshToken({
      sessionId,
      userId: userCredentials.id,
    });

    const refreshTokenHash = await this.passwordHasher.hash(issuedRefreshToken.token);

    await this.userSessionRepository.create(
      RefreshToken.create({
        id: sessionId,
        userId: userCredentials.id,
        tokenHash: refreshTokenHash,
        expiresAt: issuedRefreshToken.expiresAt,
        createdAt: new Date(),
        revokedAt: null,
      }),
    );

    return {
      accessToken,
      refreshToken: issuedRefreshToken.token,
    };
  }
}
