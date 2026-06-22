import type { Request } from "express";
import { ValidationError } from "@core/application/errors/AppError";

function getRequiredRouteParam(
  req: Request,
  paramName: string,
  errorMessage: string,
): string {
  const value = req.params[paramName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }

  return value;
}

export function getExternalResourceType(req: Request): string {
  return getRequiredRouteParam(
    req,
    "resourceType",
    "External resource type is required",
  );
}

export function getExternalResourceKey(req: Request): string {
  return getRequiredRouteParam(req, "key", "External resource key is required");
}
