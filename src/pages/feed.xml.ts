import { feedResponse } from "@/lib/feed"
import { getPublishedPosts } from "@/lib/posts"
import type { APIRoute } from "astro"

export const GET: APIRoute = async () => feedResponse(await getPublishedPosts())
