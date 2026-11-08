import type { Post, PostListItem } from "./post-types"

export const toListItem = (post: Post): PostListItem => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  excerpt: post.excerpt,
  tags: post.tags,
  series: post.series,
  part: post.part,
})
