import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { codeBlockChrome } from "./src/lib/markdown/code-block"
import { rehypeMermaid } from "./src/lib/markdown/mermaid"

export default defineConfig({
  site: "https://blog.antosubash.com",
  output: "static",
  // Astro 7 defaults to JSX-style whitespace, which drops spaces between
  // expressions and text in templates; keep HTML whitespace semantics.
  compressHTML: true,
  integrations: [mdx(), react()],
  markdown: {
    processor: unified({
      // The previous pipeline had no smart punctuation; keep post text identical.
      smartypants: false,
      rehypePlugins: [
        // Ids first so the autolinks (and our TOC) see them.
        rehypeHeadingIds,
        rehypeAutolinkHeadings,
        rehypeMermaid,
      ],
    }),
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    shikiConfig: {
      // Token colours come from the site's own light/dark palette in styles.css.
      theme: "css-variables",
      transformers: [codeBlockChrome()],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
