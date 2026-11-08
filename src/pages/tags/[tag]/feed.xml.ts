import { tagFeedResponse } from "@/lib/feed"
import { getAllPosts } from "@/lib/posts"
import { getTagFeeds } from "@/lib/tag-utils"
import type { APIRoute, GetStaticPaths } from "astro"

export const getStaticPaths = (async () => {
  const feeds = getTagFeeds(await getAllPosts())
  return [...feeds].map(([tag, posts]) => ({
    params: { tag },
    props: { posts },
  }))
}) satisfies GetStaticPaths

export const GET: APIRoute = ({ params, props }) =>
  tagFeedResponse(params.tag as string, props.posts)
