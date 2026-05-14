import { Router, type RequestHandler } from "express";
import type { AuthController } from "@api/controllers/AuthController";
import { createValidateBodyMiddleware } from "@api/middlewares/validate-request.middleware";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchemaBody,
  registerSchema,
} from "@api/schemas/auth.schemas";

export function createAuthRouter(
  controller: AuthController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.post("/register", createValidateBodyMiddleware(registerSchema), async (req, res) => {
    await controller.register(req, res);
  });
  router.post("/login", createValidateBodyMiddleware(loginSchema), async (req, res) => {
    await controller.login(req, res);
  });
  router.post(
    "/refresh-token",
    createValidateBodyMiddleware(refreshTokenSchemaBody),
    async (req, res) => {
      await controller.refreshToken(req, res);
    },
  );
  router.post("/logout", createValidateBodyMiddleware(logoutSchema), async (req, res) => {
    await controller.logout(req, res);
  });
  router.get("/me", authMiddleware, async (req, res) => {
    await controller.me(req, res);
  });

  return router;
}
