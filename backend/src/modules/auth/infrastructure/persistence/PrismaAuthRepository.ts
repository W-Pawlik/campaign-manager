import type { PrismaClient } from "@prisma/client";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { Email } from "@modules/auth/domain/value-objects/Email";
import { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

export class PrismaAuthRepository implements AuthRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async findByEmail(email: Email): Promise<UserCredentials | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { email: email.value },
    });

    if (user === null) {
      return null;
    }

    return UserCredentials.create({
      id: user.id,
      email: Email.create(user.email),
      passwordHash: PasswordHash.create(user.passwordHash),
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    });
  }

  public async findById(userId: string): Promise<UserCredentials | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (user === null) {
      return null;
    }

    return UserCredentials.create({
      id: user.id,
      email: Email.create(user.email),
      passwordHash: PasswordHash.create(user.passwordHash),
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    });
  }

  public async create(userCredentials: UserCredentials): Promise<void> {
    const defaultUsername = `user_${userCredentials.id.slice(0, 8)}`;

    await this.prismaClient.user.create({
      data: {
        id: userCredentials.id,
        email: userCredentials.email.value,
        username: defaultUsername,
        passwordHash: userCredentials.passwordHash.value,
        createdAt: userCredentials.createdAt,
      },
    });
  }
}
