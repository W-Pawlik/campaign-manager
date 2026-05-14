export interface PasswordHasher {
  hash(plainValue: string): Promise<string>;
  verify(plainValue: string, hashedValue: string): Promise<boolean>;
}
