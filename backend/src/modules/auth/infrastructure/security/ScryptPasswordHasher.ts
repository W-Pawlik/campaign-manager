import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";

const KEY_LENGTH = 64;
const SCRYPT_N = 131_072;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_MAXMEM = 256 * 1024 * 1024;
const HEX_REGEX = /^[0-9a-f]+$/i;
const SCRYPT_PREFIX = "scrypt";

export class ScryptPasswordHasher implements PasswordHasher {
  public async hash(plainValue: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await this.deriveKey(plainValue, salt, KEY_LENGTH, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: SCRYPT_MAXMEM,
    });

    return [
      SCRYPT_PREFIX,
      SCRYPT_N,
      SCRYPT_R,
      SCRYPT_P,
      KEY_LENGTH,
      salt,
      derivedKey.toString("hex"),
    ].join("$");
  }

  public async verify(plainValue: string, hashedValue: string): Promise<boolean> {
    try {
      const parts = hashedValue.split("$");

      if (parts.length === 7) {
        return await this.verifyCurrentFormat(plainValue, parts);
      }

      // Backward compatibility with old format:
      // scrypt$salt$hash
      if (parts.length === 3) {
        return await this.verifyLegacyFormat(plainValue, parts);
      }

      return false;
    } catch {
      return false;
    }
  }

  private async verifyCurrentFormat(plainValue: string, parts: string[]): Promise<boolean> {
    const [prefix, nRaw, rRaw, pRaw, keyLengthRaw, salt, storedKeyHex] = parts;

    if (
      prefix !== SCRYPT_PREFIX ||
      !nRaw ||
      !rRaw ||
      !pRaw ||
      !keyLengthRaw ||
      !salt ||
      !storedKeyHex
    ) {
      return false;
    }

    const N = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    const keyLength = Number(keyLengthRaw);

    if (
      !this.isPositiveInteger(N) ||
      !this.isPositiveInteger(r) ||
      !this.isPositiveInteger(p) ||
      !this.isPositiveInteger(keyLength)
    ) {
      return false;
    }

    if (!this.isHex(salt) || !this.isHex(storedKeyHex)) {
      return false;
    }

    const storedKey = Buffer.from(storedKeyHex, "hex");

    if (storedKey.length !== keyLength) {
      return false;
    }

    const derivedKey = await this.deriveKey(plainValue, salt, keyLength, {
      N,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    });

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
  }

  private async verifyLegacyFormat(plainValue: string, parts: string[]): Promise<boolean> {
    const [prefix, salt, storedKeyHex] = parts;

    if (prefix !== SCRYPT_PREFIX || !salt || !storedKeyHex) {
      return false;
    }

    if (!this.isHex(salt) || !this.isHex(storedKeyHex)) {
      return false;
    }

    const storedKey = Buffer.from(storedKeyHex, "hex");
    const derivedKey = await this.deriveKey(plainValue, salt, storedKey.length);

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
  }

  private isPositiveInteger(value: number): boolean {
    return Number.isSafeInteger(value) && value > 0;
  }

  private isHex(value: string): boolean {
    return value.length > 0 && value.length % 2 === 0 && HEX_REGEX.test(value);
  }

  private async deriveKey(
    plainValue: string,
    salt: string,
    keyLength: number,
    options?: ScryptOptions,
  ): Promise<Buffer> {
    return await new Promise<Buffer>((resolve, reject) => {
      const callback = (error: Error | null, derivedKey: Buffer) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      };

      if (options === undefined) {
        scryptCallback(plainValue, salt, keyLength, callback);
        return;
      }

      scryptCallback(plainValue, salt, keyLength, options, callback);
    });
  }
}
