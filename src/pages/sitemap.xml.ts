import siteMetadata from "@/config/siteMetadata"
import { getAllPosts, isPublished } from "@/lib/posts"
import { feedTagSlug } from "@/lib/tag-utils"
import type { APIRoute } from "astro"

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
  const tags = new Set(
    posts.flatMap((p) => p.tags.filter(Boolean).map(feedTagSlug))
  )

  const urls = [
    ...staticRoutes.map(
      (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.7"}</priority>
  </url>`
    ),
    ...posts.map(
      (post) => `  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${(post.lastmod || post.date).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...[...tags].map(
      (tag) => `  <url>
    <loc>${siteUrl}/tags/${tag}</loc>
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
