import { getAllPosts, isPublished } from "@/lib/posts"
import type { APIRoute } from "astro"

// Shape read by SearchProvider: { slug, title, tags, excerpt }[]
export const GET: APIRoute = async () => {
  const posts = (await getAllPosts()).filter(isPublished)
  const data = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    tags: post.tags.filter(Boolean),
    excerpt: post.excerpt,
  }))
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
  })
}
