import { AxiosError } from "axios";

export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
};

type ApiErrorResponse = {
  code?: string;
  detail?: string;
  message?: string;
  details?: unknown;
  status?: number;
  title?: string;
  type?: string;
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    return {
      status: error.response?.status ?? data?.status,
      code: data?.code ?? data?.type,
      message: data?.message ?? data?.detail ?? data?.title ?? error.message,
      details: data?.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unexpected application error.",
    details: error,
  };
}
