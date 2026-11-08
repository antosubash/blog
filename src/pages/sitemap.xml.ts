import siteMetadata from "@/config/siteMetadata"
import { type Post, getAllPosts, isPublished } from "@/lib/posts"
import { feedTagSlug } from "@/lib/tag-utils"
import type { APIRoute } from "astro"

// Routes that list posts take the newest listed post's date as their <lastmod>.
const listRoutes = new Set(["", "/posts", "/tags"])
const staticRoutes = [
  "",
  "/posts",
  "/tags",
  "/series",
  "/about",
  "/contact",
  "/projects",
  "/consulting",
]

export const GET: APIRoute = async () => {
  const siteUrl = siteMetadata.siteUrl
  const posts = (await getAllPosts()).filter(isPublished)
  const day = (p: Post) => (p.lastmod || p.date).split("T")[0]
  const newest = (list: Post[]) =>
    list.reduce<string | undefined>((max, p) => {
      const d = day(p)
      return !max || d > max ? d : max
    }, undefined)
  const lastmod = (date: string | undefined) =>
    date ? `\n    <lastmod>${date}</lastmod>` : ""

  // Tag slug -> its posts, in first-seen order (as before).
  const tags = new Map<string, Post[]>()
  for (const post of posts) {
    for (const tag of new Set(post.tags.filter(Boolean).map(feedTagSlug))) {
      tags.set(tag, [...(tags.get(tag) ?? []), post])
    }
  }
  const siteNewest = newest(posts)
  // /series only changes when a post that belongs to a series does.
  const seriesNewest = newest(posts.filter((p) => p.series))
  const routeLastmod = (route: string) =>
    route === "/series"
      ? seriesNewest
      : listRoutes.has(route)
        ? siteNewest
        : undefined

  const urls = [
    ...staticRoutes.map(
      (route) => `  <url>
    <loc>${siteUrl}${route}</loc>${lastmod(routeLastmod(route))}
    <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.7"}</priority>
  </url>`
    ),
    ...posts.map(
      (post) => `  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${day(post)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...[...tags].map(
      ([tag, tagged]) => `  <url>
    <loc>${siteUrl}/tags/${tag}</loc>${lastmod(newest(tagged))}
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`
  return new Response(xml, { headers: { "Content-Type": "application/xml" } })
}
