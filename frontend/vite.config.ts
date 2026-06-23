import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const defaultApiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET ?? "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        target: defaultApiProxyTarget,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
