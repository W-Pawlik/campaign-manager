import { Router } from "express";
import type { HealthController } from "@api/controllers/HealthController";

export function createHealthRouter(controller: HealthController): Router {
  const router = Router();

  router.get("/", (req, res) => {
    controller.getHealth(req, res);
  });

  return router;
}
