import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { ErrorMapper } from "@core/infrastructure/errors/ErrorMapper";

describe("ErrorMapper", () => {
  it("maps known application errors to consistent HTTP shape", () => {
    const mapper = new ErrorMapper();
    const result = mapper.map(new ForbiddenError("Missing permission"), "req-1");

    expect(result.status).toBe(403);
    expect(result.body).toEqual({
      type: "forbidden",
      title: "Forbidden",
      status: 403,
      detail: "Missing permission",
      requestId: "req-1",
    });
  });

  it("maps unknown errors to safe internal response", () => {
    const mapper = new ErrorMapper();
    const result = mapper.map(new Error("database exploded"), "req-2");

    expect(result.status).toBe(500);
    expect(result.body).toEqual({
      type: "internal",
      title: "Internal Server Error",
      status: 500,
      detail: "An unexpected error occurred",
      requestId: "req-2",
    });
  });
});