import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import { z } from "zod"
import readingTime from "reading-time"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypePrismPlus from "rehype-prism-plus"
import rehypePresetMinify from "rehype-preset-minify"

const siteUrl = "https://blog.antosubash.com"
const socialBanner = "/static/images/twitter-card.png"

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string().nullable().transform(v => v ?? "")).default([]),
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
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypeKatex as any,
        [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
        rehypePresetMinify,
      ],
    })

    const rt = readingTime(doc.content)
    const slug = doc._meta.fileName.replace(/\.mdx?$/, "")
    const path = `posts/${slug}`

    // Extract TOC from content
    const toc = extractTocHeadings(doc.content)

    return {
      title: doc.title,
      date: doc.date.toISOString(),
      tags: doc.tags,
      lastmod: doc.lastmod ? doc.lastmod.toISOString() : null,
      draft: doc.draft ?? false,
      isDraft: doc.isDraft ?? false,
      excerpt: doc.excerpt ?? "",
      videoId: doc.videoId ?? null,
      series: doc.series ?? null,
      part: doc.part ?? null,
      images: doc.images ?? [],
      authors: doc.authors ?? [],
      layout: doc.layout ?? null,
      bibliography: doc.bibliography ?? null,
      canonicalUrl: doc.canonicalUrl ?? null,
      mdx,
      readingTime: { text: rt.text, minutes: rt.minutes, time: rt.time, words: rt.words },
      slug,
      path,
      filePath: doc._meta.filePath,
      postUrl: `/posts/${slug}`,
      toc,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date.toISOString(),
        dateModified: (doc.lastmod || doc.date).toISOString(),
        description: doc.excerpt ?? "",
        image: doc.images ? doc.images[0] : socialBanner,
        url: `${siteUrl}/posts/${slug}`,
        fileName: slug,
      },
    }
  },
})

const authors = defineCollection({
  name: "authors",
  directory: "content/authors",
  include: "**/*.mdx",
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
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc)
    const slug = doc._meta.fileName.replace(/\.mdx?$/, "")

    return {
      name: doc.name,
      avatar: doc.avatar ?? null,
      occupation: doc.occupation ?? null,
      company: doc.company ?? null,
      email: doc.email ?? null,
      twitter: doc.twitter ?? null,
      linkedin: doc.linkedin ?? null,
      github: doc.github ?? null,
      layout: doc.layout ?? null,
      mdx,
      slug,
      path: `authors/${slug}`,
      filePath: doc._meta.filePath,
    }
  },
})

function extractTocHeadings(
  content: string
): Array<{ value: string; url: string; depth: number }> {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: Array<{ value: string; url: string; depth: number }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length
    const value = match[2].trim()
    const url = `#${value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")}`
    headings.push({ value, url, depth })
  }

  return headings
}

export default defineConfig({
  content: [posts, authors],
})
