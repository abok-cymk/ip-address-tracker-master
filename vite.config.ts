import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",

  // Build optimizations
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          react: ["react", "react-dom"],
          reactQuery: ["@tanstack/react-query"],
          leaflet: ["leaflet", "react-leaflet"],
          forms: ["react-hook-form"],
          utils: ["clsx", "zustand"],
        },
      },
    },
    // Enable source maps in production for debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },

  // Development server optimizations
  server: {
    host: true,
    port: 5173,
    // Enable HTTP/2
    https: false,
  },

  // Preview server settings
  preview: {
    host: true,
    port: 4173,
  },

  // CSS optimizations
  css: {
    devSourcemap: true,
  },

  // Enable dependency pre-bundling for better performance
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "react-hook-form",
      "clsx",
      "zustand",
      "leaflet",
      "react-leaflet",
    ],
  },
});
