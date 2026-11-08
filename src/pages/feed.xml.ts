import siteMetadata from "@/config/siteMetadata"
import { feedResponse } from "@/lib/feed"
import { renderFeedContent } from "@/lib/feed-content"
import { getPublishedPosts } from "@/lib/posts"
import type { APIRoute } from "astro"

// Feed readers poll /feed.xml often, so only the newest posts carry their full
// HTML; every item keeps the excerpt as its description.
const FULL_CONTENT_POSTS = 10

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts() // newest first
  return feedResponse(
    posts,
    await renderFeedContent(
      posts.slice(0, FULL_CONTENT_POSTS),
      siteMetadata.siteUrl
    )
  )
}
