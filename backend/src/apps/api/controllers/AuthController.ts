import type { Request, Response } from "express";
import type { CookieOptions } from "express";
import { apiConfig } from "@api/config/api.config";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { UnauthorizedError } from "@core/application/errors/AppError";
import { RegisterUserCommand } from "@modules/auth/application/commands/RegisterUserCommand";
import { LoginUserCommand } from "@modules/auth/application/commands/LoginUserCommand";
import { RefreshTokenCommand } from "@modules/auth/application/commands/RefreshTokenCommand";
import { LogoutCommand } from "@modules/auth/application/commands/LogoutCommand";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";
import { GetCurrentUserQuery } from "@modules/auth/application/queries/GetCurrentUserQuery";

export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async register(req: Request, res: Response): Promise<void> {
    const result = await this.commandBus.execute(
      new RegisterUserCommand(req.body.email, req.body.password),
    ) as AuthTokensDTO;

    this.setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({ accessToken: result.accessToken });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const result = await this.commandBus.execute(
      new LoginUserCommand(req.body.email, req.body.password),
    ) as AuthTokensDTO;

    this.setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ accessToken: result.accessToken });
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = this.getRefreshTokenFromCookie(req);
    const result = await this.commandBus.execute(
      new RefreshTokenCommand(refreshToken),
    ) as AuthTokensDTO;

    this.setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ accessToken: result.accessToken });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = this.getRefreshTokenFromCookie(req);
    await this.commandBus.execute(new LogoutCommand(refreshToken));

    this.clearRefreshTokenCookie(res);
    res.status(204).send();
  }

  public async me(_req: Request, res: Response): Promise<void> {
    const userId = res.locals.authUserId as string | undefined;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await this.queryBus.execute(new GetCurrentUserQuery(userId));

    res.status(200).json(result);
  }

  private getRefreshTokenFromCookie(req: Request): string {
    const refreshTokenCookieName = apiConfig.authRefreshCookie.name;
    const refreshToken = req.cookies?.[refreshTokenCookieName] as string | undefined;

    if (typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
      throw new UnauthorizedError("Refresh token is required");
    }

    return refreshToken;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const cookieConfig = apiConfig.authRefreshCookie;
    const options: CookieOptions = {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAgeMs,
    };

    res.cookie(cookieConfig.name, refreshToken, options);
  }

  private clearRefreshTokenCookie(res: Response): void {
    const cookieConfig = apiConfig.authRefreshCookie;

    res.clearCookie(cookieConfig.name, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
    });
  }
}
