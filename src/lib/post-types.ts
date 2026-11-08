export interface Post {
  slug: string
  title: string
  /** ISO date string */
  date: string
  lastmod: string | null
  tags: string[]
  draft: boolean
  isDraft: boolean
  excerpt: string
  videoId: string | null
  series: string | null
  part: number | null
  images: string[]
  authors: string[]
  layout: string | null
  readingTime: { text: string; minutes: number; time: number; words: number }
  filePath: string
  postUrl: string
}

/** The fields the post list island needs (keeps the serialized props small). */
export type PostListItem = Pick<
  Post,
  "slug" | "title" | "date" | "excerpt" | "tags" | "series" | "part"
>
