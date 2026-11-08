import type { Post } from "./post-types"
import { byDateDesc, isPublished } from "./posts"

/**
 * Published posts carrying any of `tags` (case-insensitive): how many there
 * are, and the newest `limit` of them. Backs the "N posts" proof on /consulting.
 */
export function postsForTags(
  posts: Post[],
  tags: string[],
  limit = 3
): { count: number; posts: Post[] } {
  const wanted = new Set(tags.map((t) => t.toLowerCase()))
  const matches = posts
    .filter(
      (p) => isPublished(p) && p.tags.some((t) => wanted.has(t.toLowerCase()))
    )
    .sort(byDateDesc)
  return { count: matches.length, posts: matches.slice(0, limit) }
}
