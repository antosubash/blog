import { slug as slugify } from "github-slugger"
import type { Post } from "./post-types"

const isPublished = (post: Post) => !post.draft && !post.isDraft
const newestFirst = (a: Post, b: Post) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

export function getTagsWithCount(posts: Post[]) {
  const published = posts.filter(isPublished)
  const counts = new Map<string, number>()
  for (const tag of published.flatMap((p) => p.tags).filter(Boolean)) {
    if (counts.has(tag)) continue
    counts.set(
      tag,
      published.filter((p) => p.tags.filter(Boolean).includes(tag)).length
    )
  }
  // Stable sort keeps first-seen order for equal counts, as before.
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Every `/tags/<x>` page the site links to: the slug of each tag, plus the raw
 * tag text where it differs (post pages link `/tags/<raw tag>`).
 */
export function getTagPageParams(posts: Post[]) {
  const tags = posts
    .filter(isPublished)
    .flatMap((p) => p.tags)
    .filter(Boolean)
  return [...new Set([...tags.map((t) => slugify(t)), ...tags])]
}

/** Posts listed on `/tags/<tag>`: published posts with a tag whose slug is `tag`. */
export function getPostsForTagPage(posts: Post[], tag: string) {
  return posts
    .filter(
      (p) =>
        isPublished(p) &&
        p.tags
          .filter(Boolean)
          .map((t) => slugify(t))
          .includes(tag)
    )
    .sort(newestFirst)
}

/** Title shown on `/tags/<tag>`. */
export function tagPageTitle(tag: string) {
  return `${tag[0].toUpperCase() + tag.split(" ").join("-").slice(1)} Articles`
}

/** Tag feeds are keyed by lower-cased, hyphenated tag text. */
export const feedTagSlug = (tag: string) =>
  tag.toLowerCase().replace(/\s+/g, "-")

export function getTagFeeds(posts: Post[]) {
  const feeds = new Map<string, Post[]>()
  for (const post of posts.filter(isPublished).sort(newestFirst)) {
    for (const tag of post.tags.filter(Boolean)) {
      const key = feedTagSlug(tag)
      const list = feeds.get(key) ?? []
      list.push(post)
      feeds.set(key, list)
    }
  }
  return feeds
}

export function getRelatedPosts(posts: Post[], slug: string) {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return []
  const published = posts.filter(isPublished).sort(newestFirst)

  if (post.series) {
    return published
      .filter((p) => p.series === post.series && p.slug !== slug)
      .slice(0, 3)
  }

  const tags = post.tags.filter(Boolean)
  return published
    .filter(
      (p) =>
        p.slug !== slug && p.tags.filter(Boolean).some((t) => tags.includes(t))
    )
    .slice(0, 3)
}
