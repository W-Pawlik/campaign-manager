import { scrypt as scryptCallback, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { ScryptPasswordHasher } from "@modules/auth/infrastructure/security/ScryptPasswordHasher";

const scrypt = promisify(scryptCallback);

describe("ScryptPasswordHasher", () => {
  it("hashes password in parameterized format and verifies it", async () => {
    const hasher = new ScryptPasswordHasher();
    const hashedValue = await hasher.hash("password123");
    const parts = hashedValue.split("$");

    expect(parts).toHaveLength(7);
    expect(parts[0]).toBe("scrypt");
    await expect(hasher.verify("password123", hashedValue)).resolves.toBe(true);
  });

  it("returns false for invalid password", async () => {
    const hasher = new ScryptPasswordHasher();
    const hashedValue = await hasher.hash("password123");

    await expect(hasher.verify("wrong-password", hashedValue)).resolves.toBe(false);
  });

  it("verifies legacy hash format for backward compatibility", async () => {
    const hasher = new ScryptPasswordHasher();
    const plainValue = "legacy-password";
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(plainValue, salt, 64)) as Buffer;
    const legacyHash = `scrypt$${salt}$${derivedKey.toString("hex")}`;

    await expect(hasher.verify(plainValue, legacyHash)).resolves.toBe(true);
  });

  it("returns false for malformed hash", async () => {
    const hasher = new ScryptPasswordHasher();

    await expect(hasher.verify("password123", "scrypt$broken")).resolves.toBe(false);
  });
});