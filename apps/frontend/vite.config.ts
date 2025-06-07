import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    commonjsOptions: {
      include: [/lucide-react/, /node_modules/],
    },
    outDir: "dist",
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:7105",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
