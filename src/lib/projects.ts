import type { Post } from "./post-types"

export type PostWithBody = { post: Post; body: string }

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * A project's pinned posts, then published posts that link to any of its repos
 * (current names or old aliases), newest first. "github.com/antosubash/abp-react" must not match a link
 * to "abp-react-tanstack", so the name has to end the URL path segment.
 */
export function relatedPosts(
  repos: string[],
  posts: PostWithBody[],
  limit = 3,
  /** Slugs to show first, in this order (a project's main posts). */
  pinned: string[] = []
): Post[] {
  const names = repos
    .map((r) => escapeRegExp(r.split("/").pop() ?? r))
    .join("|")
  const link = new RegExp(
    `github\\.com/antosubash/(?:${names})(?:\\.git)?(?![\\w.-])`,
    "i"
  )
  const published = posts.filter(({ post }) => !post.draft && !post.isDraft)
  const first = pinned.flatMap((slug) =>
    published.filter(({ post }) => post.slug === slug).map(({ post }) => post)
  )
  const rest = published
    .filter(({ post, body }) => !pinned.includes(post.slug) && link.test(body))
    .map(({ post }) => post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return [...first, ...rest].slice(0, limit)
}
