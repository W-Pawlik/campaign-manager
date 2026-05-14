import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ForbiddenError } from "@core/application/errors/AppError";
import { RegisterUserCommand } from "@modules/auth/application/commands/RegisterUserCommand";
import { LoginUserCommand } from "@modules/auth/application/commands/LoginUserCommand";
import { RefreshTokenCommand } from "@modules/auth/application/commands/RefreshTokenCommand";
import { LogoutCommand } from "@modules/auth/application/commands/LogoutCommand";
import { GetCurrentUserQuery } from "@modules/auth/application/queries/GetCurrentUserQuery";

export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async register(req: Request, res: Response): Promise<void> {
    const result = await this.commandBus.execute(
      new RegisterUserCommand(req.body.email, req.body.password),
    );

    res.status(201).json(result);
  }

  public async login(req: Request, res: Response): Promise<void> {
    const result = await this.commandBus.execute(new LoginUserCommand(req.body.email, req.body.password));

    res.status(200).json(result);
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const result = await this.commandBus.execute(new RefreshTokenCommand(req.body.refreshToken));

    res.status(200).json(result);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    await this.commandBus.execute(new LogoutCommand(req.body.refreshToken));

    res.status(204).send();
  }

  public async me(_req: Request, res: Response): Promise<void> {
    const userId = res.locals.authUserId as string | undefined;

    if (!userId) {
      throw new ForbiddenError("Authentication required");
    }

    const result = await this.queryBus.execute(new GetCurrentUserQuery(userId));

    res.status(200).json(result);
  }
}
