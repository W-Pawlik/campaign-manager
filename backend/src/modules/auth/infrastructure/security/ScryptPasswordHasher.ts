import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export class ScryptPasswordHasher implements PasswordHasher {
  public async hash(plainValue: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(plainValue, salt, KEY_LENGTH)) as Buffer;

    return `scrypt$${salt}$${derivedKey.toString("hex")}`;
  }

  public async verify(plainValue: string, hashedValue: string): Promise<boolean> {
    const parts = hashedValue.split("$");

    if (parts.length !== 3 || parts[0] !== "scrypt") {
      return false;
    }

    const salt = parts[1];
    const storedKeyHex = parts[2];

    if (salt === undefined || storedKeyHex === undefined) {
      return false;
    }

    const storedKey = Buffer.from(storedKeyHex, "hex");
    const derivedKey = (await scrypt(plainValue, salt, storedKey.length)) as Buffer;

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
  }
}
