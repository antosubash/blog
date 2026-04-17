import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const siteUrl = "https://blog.antosubash.com"

interface PostData {
  slug: string
  date: string
  lastmod: string | null
  draft: boolean
  isDraft: boolean
  tags: string[]
}

async function main() {
  const postsPath = path.resolve(".content-collections/generated/allPosts.js")
  const mod = await import(pathToFileURL(postsPath).href)
  const allPosts: PostData[] = mod.allPosts || mod.default

  const posts = allPosts.filter((p) => !p.draft && !p.isDraft)

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

  const tags = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags.filter(Boolean)) {
      tags.add(tag.toLowerCase().replace(/\s+/g, "-"))
    }
  }

  const urls: string[] = []

  for (const route of staticRoutes) {
    urls.push(`  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.7"}</priority>
  </url>`)
  }

  for (const post of posts) {
    const lastmod = post.lastmod || post.date
    urls.push(`  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  }

  for (const tag of tags) {
    urls.push(`  <url>
    <loc>${siteUrl}/tags/${tag}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`

  fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap)
  console.log(`Generated sitemap.xml with ${urls.length} URLs`)
}

main().catch(console.error)
