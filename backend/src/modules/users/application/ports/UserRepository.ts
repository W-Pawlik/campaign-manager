import type { User } from "@modules/users/domain/entities/User";
import type { Username } from "@modules/users/domain/value-objects/Username";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
  save(user: User): Promise<void>;
  softDelete(id: string, deletedAt: Date): Promise<void>;
}
