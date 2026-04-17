import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const siteUrl = "https://blog.antosubash.com"
const siteTitle = "Anto Subash"
const siteDescription =
  "Full-stack developer passionate about web technologies, microservices, and modern software development."

interface PostData {
  title: string
  slug: string
  date: string
  excerpt: string
  draft: boolean
  isDraft: boolean
  tags: string[]
  postUrl: string
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function generateRssFeed(
  posts: PostData[],
  feedTitle: string,
  feedPath: string
) {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}${post.postUrl}</link>
      <guid>${siteUrl}${post.postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
    </item>`
    )
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/${feedPath}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  const outPath = path.resolve("public", feedPath)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, rss)
  console.log(`Generated ${feedPath} with ${posts.length} items`)
}

async function main() {
  const postsPath = path.resolve(".content-collections/generated/allPosts.js")
  const mod = await import(pathToFileURL(postsPath).href)
  const allPosts: PostData[] = mod.allPosts || mod.default

  const posts = allPosts
    .filter((p) => !p.draft && !p.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  generateRssFeed(posts, siteTitle, "feed.xml")

  const tagMap = new Map<string, PostData[]>()
  for (const post of posts) {
    for (const tag of post.tags.filter(Boolean)) {
      const slug = tag.toLowerCase().replace(/\s+/g, "-")
      if (!tagMap.has(slug)) tagMap.set(slug, [])
      const tagPosts = tagMap.get(slug)
      if (tagPosts) {
        tagPosts.push(post)
      }
    }
  }

  for (const [tagSlug, tagPosts] of tagMap) {
    generateRssFeed(
      tagPosts,
      `${siteTitle} - ${tagSlug}`,
      `tags/${tagSlug}/feed.xml`
    )
  }
}

main().catch(console.error)
