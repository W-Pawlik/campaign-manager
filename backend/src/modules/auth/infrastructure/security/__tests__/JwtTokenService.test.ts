import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "@core/application/errors/AppError";
import { coreConfig } from "@core/config/core.config";
import { JwtTokenService } from "@modules/auth/infrastructure/security/JwtTokenService";

describe("JwtTokenService key rotation", () => {
  it("issues access token with active key id", () => {
    const tokenService = new JwtTokenService();

    const token = tokenService.issueAccessToken({
      userId: "user-1",
      email: "user@example.com",
    });
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken || typeof decodedToken !== "object") {
      throw new Error("Expected token to decode to object payload");
    }

    expect(decodedToken.header.kid).toBe(coreConfig.auth.accessTokenKeys.active.kid);
  });

  it("verifies access token signed with previous key", () => {
    const tokenService = new JwtTokenService();
    const previousKey = coreConfig.auth.accessTokenKeys.previous;

    if (!previousKey) {
      throw new Error("Previous access key must be configured in test setup");
    }

    const token = jwt.sign(
      {
        sub: "user-1",
        email: "user@example.com",
        type: "access",
      },
      previousKey.secret,
      {
        keyid: previousKey.kid,
        expiresIn: coreConfig.auth.accessTokenTtlSeconds,
      },
    );

    const payload = tokenService.verifyAccessToken(token);

    expect(payload).toEqual({
      userId: "user-1",
      email: "user@example.com",
    });
  });

  it("rejects token with unknown key id", () => {
    const tokenService = new JwtTokenService();

    const token = jwt.sign(
      {
        sub: "user-1",
        email: "user@example.com",
        type: "access",
      },
      "unknown-secret",
      {
        keyid: "unknown-kid",
        expiresIn: coreConfig.auth.accessTokenTtlSeconds,
      },
    );

    expect(() => tokenService.verifyAccessToken(token)).toThrow(UnauthorizedError);
  });
});
