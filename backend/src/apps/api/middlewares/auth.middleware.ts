import type { RequestHandler } from "express";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { RequestContextStore } from "@core/application/context/RequestContextStore";
import type { TokenService } from "@modules/auth/application/ports/TokenService";

export function createAuthMiddleware(
  tokenService: TokenService,
  requestContextStore: RequestContextStore,
): RequestHandler {
  return (req, res, next) => {
    const authorizationHeader = req.header("authorization");

    if (!authorizationHeader) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || token === undefined || token.trim().length === 0) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    try {
      const payload = tokenService.verifyAccessToken(token);
      requestContextStore.set({ userId: payload.userId });
      res.locals.authUserId = payload.userId;
      next();
    } catch (error) {
      next(error);
    }
  };
}
