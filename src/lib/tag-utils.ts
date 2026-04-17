import { allPosts } from "content-collections"

interface Post {
  title: string
  date: string
  tags: string[]
  slug: string
  draft?: boolean
  isDraft?: boolean
  excerpt?: string
  series?: string | null
  part?: number | null
  [key: string]: unknown
}

function isPublishedPost(post: Post) {
  return !post.draft && !post.isDraft
}

export function getAllTags() {
  const allTags = (allPosts as Post[])
    .filter(isPublishedPost)
    .flatMap((post: Post) => post.tags)
    .filter((tag: string) => tag)
  const tags = allTags.filter(
    (item: string, index: number) => allTags.indexOf(item) === index
  )
  return tags as string[]
}

export function getTagsWithCount() {
  const publishedPosts = (allPosts as Post[]).filter(isPublishedPost)
  const tags = publishedPosts
    .flatMap((post: Post) => post.tags)
    .filter((tag: string) => tag)
  let allMappedTags = tags
    .map((tag: string) => {
      return {
        tag: tag,
        count: publishedPosts.filter((post: Post) =>
          post.tags?.filter((t: string) => t).includes(tag)
        ).length,
      } as { tag: string; count: number }
    })
    .sort(
      (a: { tag: string; count: number }, b: { tag: string; count: number }) =>
        b.count - a.count
    )

  allMappedTags = allMappedTags.filter(
    (item: { tag: string; count: number }, index: number) =>
      allMappedTags.findIndex(
        (i: { tag: string; count: number }) => i.tag === item.tag
      ) === index
  )

  return allMappedTags
}

export function getRelatedPosts(slug: string) {
  const post = (allPosts as Post[]).find((p: Post) => p.slug === slug)
  if (!post) return []

  const publishedPosts = (allPosts as Post[]).filter(isPublishedPost)

  if (post.series) {
    const seriesPosts = publishedPosts
      .sort(
        (a: Post, b: Post) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .filter((p: Post) => p.series === post.series)
    return seriesPosts.filter((p: Post) => p.slug !== slug).slice(0, 3)
  }

  const relatedPosts = publishedPosts
    .sort(
      (a: Post, b: Post) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .filter(
      (p: Post) =>
        p.slug !== slug &&
        p.tags
          ?.filter((tag: string) => tag)
          .some((tag: string) =>
            post.tags?.filter((t: string) => t).includes(tag)
          )
    )
    .slice(0, 3)

  return relatedPosts
}
