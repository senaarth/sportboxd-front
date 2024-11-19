import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ["react-helmet-async", "node-html-to-image"],
  },
  build: {
    outDir: isSsrBuild ? "dist/server" : "dist/client",
    ssr: isSsrBuild ? "src/entry-server.tsx" : false,
    rollupOptions: {
      input: isSsrBuild ? "src/entry-server.tsx" : "index.html",
    },
  },
}));
