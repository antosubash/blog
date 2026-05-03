import { readFile } from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { SITE_URL } from "../config"

const POSTS_DIR = path.resolve(process.cwd(), "content/posts")

export type LoadedPost = {
  slug: string
  filePath: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  body: string
  postUrl: string
}

export async function loadPost(slug: string): Promise<LoadedPost> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  const raw = await readFile(filePath, "utf8")
  const parsed = matter(raw)
  const data = parsed.data as Record<string, unknown>

  const title = String(data.title ?? slug)
  const excerpt = String(data.excerpt ?? "")
  const tagsValue = data.tags
  const tags = Array.isArray(tagsValue)
    ? tagsValue.map((t) => String(t)).filter(Boolean)
    : []
  const date = data.date ? String(data.date) : ""

  const slugParts = slug.split("/")
  const slugBasename = slugParts[slugParts.length - 1] ?? slug

  return {
    slug,
    filePath,
    title,
    excerpt,
    tags,
    date,
    body: parsed.content,
    postUrl: `${SITE_URL}/posts/${slugBasename}`,
  }
}
