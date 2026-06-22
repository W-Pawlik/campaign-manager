import { Router, type RequestHandler } from "express";
import type { ExternalOpen5eController } from "@api/controllers/ExternalOpen5eController";

export function createExternalOpen5eRouter(
  controller: ExternalOpen5eController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/search", authMiddleware, async (req, res) => {
    await controller.search(req, res);
  });
  router.get("/resources/:resourceType/:key", authMiddleware, async (req, res) => {
    await controller.getResourceDetails(req, res);
  });

  return router;
}
