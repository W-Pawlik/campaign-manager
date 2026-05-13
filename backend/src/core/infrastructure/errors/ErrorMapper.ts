import { ZodError } from "zod";
import { AppError, ValidationError } from "@core/application/errors/AppError";

export interface HttpErrorPayload {
  type: string;
  title: string;
  status: number;
  detail: string;
  requestId?: string;
}

export interface MappedHttpError {
  status: number;
  body: HttpErrorPayload;
}

export class ErrorMapper {
  public map(error: unknown, requestId?: string): MappedHttpError {
    if (error instanceof ZodError) {
      const validationError = new ValidationError("Request validation failed", error);

      return {
        status: validationError.status,
        body: this.withRequestId(
          {
            type: validationError.type,
            title: validationError.title,
            status: validationError.status,
            detail: validationError.message,
          },
          requestId,
        ),
      };
    }

    if (error instanceof AppError) {
      return {
        status: error.status,
        body: this.withRequestId(
          {
            type: error.type,
            title: error.title,
            status: error.status,
            detail: error.message,
          },
          requestId,
        ),
      };
    }

    return {
      status: 500,
      body: this.withRequestId(
        {
          type: "internal",
          title: "Internal Server Error",
          status: 500,
          detail: "An unexpected error occurred",
        },
        requestId,
      ),
    };
  }

  private withRequestId(
    payload: Omit<HttpErrorPayload, "requestId">,
    requestId?: string,
  ): HttpErrorPayload {
    if (requestId === undefined) {
      return payload;
    }

    return {
      ...payload,
      requestId,
    };
  }
}
