export type AppErrorType =
  | "validation"
  | "not_found"
  | "forbidden"
  | "conflict"
  | "external_service"
  | "infrastructure"
  | "internal";

export interface AppErrorParams {
  type: AppErrorType;
  title: string;
  status: number;
  detail: string;
  cause?: unknown;
}

export class AppError extends Error {
  public readonly type: AppErrorType;
  public readonly title: string;
  public readonly status: number;

  public constructor(params: AppErrorParams) {
    super(params.detail);
    this.name = this.constructor.name;
    this.type = params.type;
    this.title = params.title;
    this.status = params.status;

    if (params.cause !== undefined) {
      this.cause = params.cause;
    }
  }
}

export class ValidationError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "validation",
      title: "Validation Error",
      status: 400,
      detail,
      cause,
    });
  }
}

export class NotFoundError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "not_found",
      title: "Not Found",
      status: 404,
      detail,
      cause,
    });
  }
}

export class ForbiddenError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "forbidden",
      title: "Forbidden",
      status: 403,
      detail,
      cause,
    });
  }
}

export class ConflictError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "conflict",
      title: "Conflict",
      status: 409,
      detail,
      cause,
    });
  }
}

export class ExternalServiceError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "external_service",
      title: "External Service Error",
      status: 502,
      detail,
      cause,
    });
  }
}

export class InfrastructureError extends AppError {
  public constructor(detail: string, cause?: unknown) {
    super({
      type: "infrastructure",
      title: "Infrastructure Error",
      status: 500,
      detail,
      cause,
    });
  }
}