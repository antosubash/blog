import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

interface PostData {
  title: string
  slug: string
  tags: string[]
  excerpt: string
  draft: boolean
  isDraft: boolean
  date: string
}

async function generateSearchIndex() {
  const postsPath = path.resolve(".content-collections/generated/allPosts.js")
  const mod = await import(pathToFileURL(postsPath).href)
  const posts: PostData[] = mod.allPosts || mod.default

  const searchData = posts
    .filter((post) => !post.draft && !post.isDraft)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      tags: post.tags.filter(Boolean),
      excerpt: post.excerpt || "",
    }))

  const outDir = path.resolve("public")
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, "search.json"),
    JSON.stringify(searchData, null, 2)
  )

  console.log(`Generated search.json with ${searchData.length} posts`)
}

generateSearchIndex().catch(console.error)
