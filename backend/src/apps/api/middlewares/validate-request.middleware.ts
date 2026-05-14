import type { RequestHandler } from "express";
import type { z } from "zod";

export function createValidateBodyMiddleware<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): RequestHandler {
  return (req, _res, next) => {
    const parsedBody = schema.parse(req.body);
    req.body = parsedBody;
    next();
  };
}
