import type { Router } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApiApp } from "@api/app";
import { loadApiContainerModule } from "@api/di/api.container-module";
import { ForbiddenError } from "@core/application/errors/AppError";
import { buildContainer } from "@core/di/container";
import { loadAuthContainerModule } from "@modules/auth/auth.container-module";

describe("API error handler integration", () => {
  it("returns mapped known error response", async () => {
    const app = createApiApp({
      container: buildContainer(loadAuthContainerModule, loadApiContainerModule),
      registerAdditionalRoutes: (router: Router) => {
        router.get("/__test/known-error", () => {
          throw new ForbiddenError("Access denied");
        });
      },
    });

    const response = await request(app).get("/__test/known-error");

    expect(response.status).toBe(403);
    expect(response.body.type).toBe("forbidden");
    expect(response.body.title).toBe("Forbidden");
    expect(response.body.status).toBe(403);
    expect(response.body.detail).toBe("Access denied");
    expect(typeof response.body.requestId).toBe("string");
  });

  it("returns safe unknown error response with requestId", async () => {
    const app = createApiApp({
      container: buildContainer(loadAuthContainerModule, loadApiContainerModule),
      registerAdditionalRoutes: (router: Router) => {
        router.get("/__test/unknown-error", () => {
          throw new Error("Sensitive internals");
        });
      },
    });

    const response = await request(app).get("/__test/unknown-error");

    expect(response.status).toBe(500);
    expect(response.body.type).toBe("internal");
    expect(response.body.title).toBe("Internal Server Error");
    expect(response.body.status).toBe(500);
    expect(response.body.detail).toBe("An unexpected error occurred");
    expect(typeof response.body.requestId).toBe("string");
  });
});
