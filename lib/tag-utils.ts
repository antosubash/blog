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
