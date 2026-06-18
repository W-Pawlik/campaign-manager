import axios from "axios";

import { env } from "@/app/config/env";
import { normalizeApiError } from "@/core/api/apiError";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
