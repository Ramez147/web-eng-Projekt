import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import path from "path";

// load .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});