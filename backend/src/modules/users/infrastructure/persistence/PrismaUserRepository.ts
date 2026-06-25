import type { PrismaClient } from "@prisma/client";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import type { User as UserEntity } from "@modules/users/domain/entities/User";
import type { Username } from "@modules/users/domain/value-objects/Username";
import type { UserMapper } from "@modules/users/infrastructure/persistence/UserMapper";

export class PrismaUserRepository implements UserRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly userMapper: UserMapper,
  ) {}

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (user === null) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  public async findByUsername(username: Username): Promise<UserEntity | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { username: username.value },
    });

    if (user === null) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  public async search(query: string, limit: number): Promise<UserEntity[]> {
    const users = await this.prismaClient.user.findMany({
      where: {
        deletedAt: null,
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: [{ username: "asc" }],
      take: limit,
    });

    return users.map((user) => this.userMapper.toDomain(user));
  }

  public async save(user: UserEntity): Promise<void> {
    await this.prismaClient.user.update({
      where: { id: user.id },
      data: this.userMapper.toPersistenceUpdate(user),
    });
  }

  public async softDelete(id: string, deletedAt: Date): Promise<void> {
    await this.prismaClient.user.update({
      where: { id },
      data: {
        deletedAt,
      },
    });
  }
}
