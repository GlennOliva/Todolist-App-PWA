import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My PWA Todolist App",
        short_name: "Todolist",
        description: "A simple Progressive Web App for managing your tasks",
        theme_color: "#4CAF50",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "icons/to-do-list.png", // Removed leading slash
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/to-do-list.png", // Removed leading slash
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/, // Replace with your actual API
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Set to false in production
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
