import contentCollections from "@content-collections/vite"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import viteTsConfigPaths from "vite-tsconfig-paths"

export default defineConfig(async ({ mode }) => ({
  plugins: [
    ...(mode === "development"
      ? [await import("@tanstack/devtools-vite").then((m) => m.devtools())]
      : []),
    nitro({
      preset: "vercel",
    }),
    contentCollections(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],
  environments: {
    client: {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              mermaid: ["mermaid"],
            },
          },
        },
      },
    },
  },
}))
