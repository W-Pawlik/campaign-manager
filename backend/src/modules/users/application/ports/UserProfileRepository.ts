import type { UserProfile } from "@modules/users/domain/entities/UserProfile";

export interface UserProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
}
