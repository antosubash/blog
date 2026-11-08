import siteMetadata from "@/config/siteMetadata"
import { feedResponse } from "@/lib/feed"
import { renderFeedContent } from "@/lib/feed-content"
import { getPublishedPosts } from "@/lib/posts"
import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()
  return feedResponse(
    posts,
    await renderFeedContent(posts, siteMetadata.siteUrl)
  )
}
