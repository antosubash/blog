import { allPosts } from 'contentlayer/generated'
export function getAllTags() {
  const allTags = allPosts.flatMap((post) => post.tags)
  const tags = allTags.filter((item, index) => allTags.indexOf(item) === index)
  return tags as string[]
}

export function getTagsWithCount() {
  const tags = allPosts.flatMap((post) => post.tags)
  let allMappedTags = tags
    .map((tag) => {
      return {
        tag: tag,
        count: allPosts.filter((post) => post.tags.includes(tag)).length,
      } as { tag: string; count: number }
    })
    .sort((a, b) => b.count - a.count)

  // Remove duplicates

  allMappedTags = allMappedTags.filter(
    (item, index) => allMappedTags.findIndex((i) => i.tag === item.tag) === index
  )

  return allMappedTags
}

export function getRelatedPosts(slug: string) {
  // get 3 the related posts based on the slug
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return []

  // check if the post is part of the series filter by latest 3
  if (post.series) {
    const seriesPosts = allPosts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((p) => p.series === post.series)
    return seriesPosts.filter((p) => p.slug !== slug).slice(0, 3)
  }

  const relatedPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((p) => p.slug !== slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3)

  return relatedPosts
}
