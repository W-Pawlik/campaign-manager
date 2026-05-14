import { ForbiddenError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";
import type { LoginUserCommand } from "@modules/auth/application/commands/LoginUserCommand";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { Email } from "@modules/auth/domain/value-objects/Email";

export class LoginUserHandler implements CommandHandler<LoginUserCommand, AuthTokensDTO> {
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly authTokensIssuer: AuthTokensIssuer,
  ) {}

  public async execute(command: LoginUserCommand): Promise<AuthTokensDTO> {
    const email = Email.create(command.email);
    const userCredentials = await this.authRepository.findByEmail(email);

    if (userCredentials === null) {
      throw new ForbiddenError("Invalid email or password");
    }

    const isPasswordValid = await this.passwordHasher.verify(
      command.password,
      userCredentials.passwordHash.value,
    );

    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid email or password");
    }

    return await this.authTokensIssuer.issueForUser(userCredentials);
  }
}
