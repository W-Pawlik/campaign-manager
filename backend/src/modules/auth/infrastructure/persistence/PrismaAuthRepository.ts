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
      createdAt: user.createdAt,
    });
  }

  public async create(userCredentials: UserCredentials): Promise<void> {
    const emailLocalPart = userCredentials.email.value.split("@")[0] ?? "user";
    const normalizedLocalPart = emailLocalPart.trim().length > 0 ? emailLocalPart.trim() : "user";
    const defaultDisplayName =
      (normalizedLocalPart.length >= 2 ? normalizedLocalPart : `${normalizedLocalPart}_user`).slice(
        0,
        80,
      );
    const defaultUsername = `user_${userCredentials.id.slice(0, 8)}`;

    await this.prismaClient.user.create({
      data: {
        id: userCredentials.id,
        email: userCredentials.email.value,
        username: defaultUsername,
        displayName: defaultDisplayName,
        passwordHash: userCredentials.passwordHash.value,
        createdAt: userCredentials.createdAt,
      },
    });
  }
}
