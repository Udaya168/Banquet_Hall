import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [tsConfigPaths(), tailwindcss(), react()],
});

