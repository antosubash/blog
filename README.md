# blog.antosubash.com

Personal blog, built with [Astro](https://astro.build) as a fully static site.

## Commands

| Command          | What it does                                            |
| ---------------- | ------------------------------------------------------- |
| `pnpm dev`       | Dev server on http://localhost:3000                     |
| `pnpm build`     | Static build into `dist/`                               |
| `pnpm preview`   | Serve `dist/` on http://localhost:3000                  |
| `pnpm lint`      | Biome lint + format check (`pnpm format` to fix)        |
| `pnpm typecheck` | `astro check` plus the Remotion `video/` project        |
| `pnpm test`      | Vitest unit tests                                       |

## Layout

- `content/posts/**/*.mdx`: posts. The URL is `/posts/<file name>`; folders are only
  for organising. Frontmatter schema: `src/content.config.ts`.
- `src/pages/`: routes. Besides the pages, `feed.xml`, `tags/<tag>/feed.xml`,
  `sitemap.xml`, `search.json` and `og/<slug>.png` are static endpoints generated at
  build time (nothing is written into `public/`).
- `src/components/`: `.astro` components for static UI; React (`.tsx`) only for the
  interactive islands (search palette, mobile nav, post list filters).
- `src/lib/markdown/`: the code block header (Shiki transformer) and Mermaid plugin.
- `video/`: Remotion pipeline that turns a post into a YouTube video (see its README).

## Deploying

Vercel builds it as a static Astro site (`vercel.json`). The `Dockerfile` builds the
site and serves `dist/` with nginx on port 3000.
