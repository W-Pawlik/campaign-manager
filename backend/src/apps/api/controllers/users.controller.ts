import type { Request, Response } from "express";
import type { CommandBus } from "@core/application/cqrs/CommandBus";
import type { QueryBus } from "@core/application/cqrs/QueryBus";
import { ForbiddenError } from "@core/application/errors/AppError";
import { ChangeCurrentUserPasswordCommand } from "@modules/users/application/commands/ChangeCurrentUserPasswordCommand";
import { DeleteCurrentUserAccountCommand } from "@modules/users/application/commands/DeleteCurrentUserAccountCommand";
import { UpdateCurrentUserProfileCommand } from "@modules/users/application/commands/UpdateCurrentUserProfileCommand";
import { GetCurrentUserProfileQuery } from "@modules/users/application/queries/GetCurrentUserProfileQuery";

export class UsersController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getCurrentUserProfile(_req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.queryBus.execute(new GetCurrentUserProfileQuery({ userId }));

    res.status(200).json(result);
  }

  public async updateCurrentUserProfile(req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);
    const result = await this.commandBus.execute(
      new UpdateCurrentUserProfileCommand({
        userId,
        ...req.body,
      }),
    );

    res.status(200).json(result);
  }

  public async changeCurrentUserPassword(req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);

    await this.commandBus.execute(
      new ChangeCurrentUserPasswordCommand({
        userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      }),
    );

    res.status(204).send();
  }

  public async deleteCurrentUserAccount(_req: Request, res: Response): Promise<void> {
    const userId = this.getAuthUserId(res);

    await this.commandBus.execute(new DeleteCurrentUserAccountCommand({ userId }));

    res.status(204).send();
  }

  private getAuthUserId(res: Response): string {
    const userId = res.locals.authUserId as string | undefined;

    if (!userId) {
      throw new ForbiddenError("Authentication required");
    }

    return userId;
  }
}
