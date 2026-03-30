import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api-proxy": {
        target: "https://preprodapisix.omnenest.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
        secure: false,
        headers: {
          Origin: "https://preprodapisix.omnenest.com",
          Referer: "https://preprodapisix.omnenest.com",
        },
      },
    },
  },
});
