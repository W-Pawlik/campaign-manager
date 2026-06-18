import { env } from "@/app/config/env";

export const appConstants = {
  appName: env.appName,
} as const;
