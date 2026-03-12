import { format } from "date-fns"

// Types for content collections posts
export interface PostCore {
  title: string
  date: Date
  tags: string[]
  lastmod?: Date
  draft?: boolean
  isDraft?: boolean
  excerpt?: string
  videoId?: string
  series?: string
  part?: number
  images?: string[]
  authors?: string[]
  layout?: string
  slug: string
  path: string
  postUrl: string
  readingTime: { text: string; minutes: number; time: number; words: number }
  toc: Array<{ value: string; url: string; depth: number }>
  filePath: string
}

export function sortPosts<T extends { date: Date }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function allCoreContent<T extends { draft?: boolean; isDraft?: boolean }>(
  posts: T[]
): T[] {
  return posts.filter((post) => !post.draft && !post.isDraft)
}

export function coreContent<T>(post: T): T {
  return post
}

export function formatDate(date: string | Date, _locale: string = "en-US"): string {
  return format(new Date(date), "MMMM d, yyyy")
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
