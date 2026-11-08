import type { Post } from "./post-types"
import { byDateDesc, isPublished } from "./posts"

export type PostWithBody = { post: Post; body: string }

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * A project's pinned posts, then published posts that link to any of its repos
 * (current names or old aliases), newest first. A link to
 * "github.com/antosubash/abp-react" must not match "abp-react-tanstack", so
 * the name has to end the URL path segment.
 */
export function relatedPosts(
  repos: string[],
  posts: PostWithBody[],
  limit = 3,
  /** Slugs to show first, in this order (a project's main posts). */
  pinned: string[] = []
): Post[] {
  // Bare aliases take the owner of the first "owner/name" repo.
  const defaultOwner = repos.find((r) => r.includes("/"))?.split("/")[0]
  const targets = repos
    .map((r) => {
      const [owner, name] = r.includes("/") ? r.split("/") : [defaultOwner, r]
      return owner ? `${escapeRegExp(owner)}/${escapeRegExp(name)}` : null
    })
    .filter(Boolean)
    .join("|")
  // The name must end the path segment: "." only ends it when not followed by a
  // word character, so a sentence-ending "...abp-react." still matches.
  const link = new RegExp(
    `github\\.com/(?:${targets})(?:\\.git)?(?![\\w-]|\\.\\w)`,
    "i"
  )
  const published = posts.filter(({ post }) => isPublished(post))
  const first = pinned.flatMap((slug) =>
    published.filter(({ post }) => post.slug === slug).map(({ post }) => post)
  )
  const rest = published
    .filter(({ post, body }) => !pinned.includes(post.slug) && link.test(body))
    .map(({ post }) => post)
    .sort(byDateDesc)
  return [...first, ...rest].slice(0, limit)
}
