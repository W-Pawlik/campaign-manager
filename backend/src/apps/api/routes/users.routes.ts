import { Router, type RequestHandler } from "express";
import type { UsersController } from "@api/controllers/users.controller";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  changeCurrentUserPasswordSchema,
  updateCurrentUserProfileSchema,
} from "@api/schemas/users.schemas";

export function createUsersRouter(
  controller: UsersController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/me", authMiddleware, async (req, res) => {
    await controller.getCurrentUserProfile(req, res);
  });
  router.patch(
    "/me",
    authMiddleware,
    createValidateBodyMiddleware(updateCurrentUserProfileSchema),
    async (req, res) => {
      await controller.updateCurrentUserProfile(req, res);
    },
  );
  router.patch(
    "/me/password",
    authMiddleware,
    createValidateBodyMiddleware(changeCurrentUserPasswordSchema),
    async (req, res) => {
      await controller.changeCurrentUserPassword(req, res);
    },
  );
  router.delete("/me", authMiddleware, async (req, res) => {
    await controller.deleteCurrentUserAccount(req, res);
  });

  return router;
}
