import { randomUUID } from "node:crypto";
import { ConflictError, ValidationError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";
import type { RegisterUserCommand } from "@modules/auth/application/commands/RegisterUserCommand";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { Email } from "@modules/auth/domain/value-objects/Email";
import { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

export class RegisterUserHandler
  implements CommandHandler<RegisterUserCommand, AuthTokensDTO>
{
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly authTokensIssuer: AuthTokensIssuer,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<AuthTokensDTO> {
    if (command.password.length < 8) {
      throw new ValidationError("Password must have at least 8 characters");
    }

    const email = Email.create(command.email);
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser !== null) {
      throw new ConflictError("User with this email already exists");
    }

    const passwordHashValue = await this.passwordHasher.hash(command.password);
    const passwordHash = PasswordHash.create(passwordHashValue);
    const userCredentials = UserCredentials.create({
      id: randomUUID(),
      email,
      passwordHash,
      createdAt: new Date(),
    });

    await this.authRepository.create(userCredentials);

    return await this.authTokensIssuer.issueForUser(userCredentials);
  }
}
