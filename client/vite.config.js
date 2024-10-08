import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://blog-app-two-flax.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
