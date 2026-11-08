import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// Entry ids are the file name without extension; the folder is only for
// organising sources (`content/posts/abp/foo.mdx` -> `/posts/foo`).
const fileNameId = ({ entry }: { entry: string }) =>
  entry.replace(/^.*\//, "").replace(/\.mdx?$/, "")

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./content/posts",
    generateId: fileNameId,
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z
      .array(
        z
          .string()
          .nullable()
          .transform((v) => v ?? "")
      )
      .default([]),
    lastmod: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    isDraft: z.boolean().optional(),
    excerpt: z.string().optional(),
    videoId: z.string().nullable().optional(),
    series: z.string().optional(),
    part: z.number().optional(),
    images: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    layout: z.string().optional(),
    bibliography: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
})

const authors = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./content/authors",
    generateId: fileNameId,
  }),
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    layout: z.string().optional(),
  }),
})

export const collections = { posts, authors }
