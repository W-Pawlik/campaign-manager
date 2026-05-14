import type { Email } from "@modules/auth/domain/value-objects/Email";
import type { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";

export interface AuthRepository {
  findByEmail(email: Email): Promise<UserCredentials | null>;
  findById(userId: string): Promise<UserCredentials | null>;
  create(userCredentials: UserCredentials): Promise<void>;
}
