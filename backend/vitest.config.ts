import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    setupFiles: ["src/__tests__/setup-env.ts"],
  },
});
