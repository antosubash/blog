import type { Post } from "./post-types"

export interface SeriesPost {
  slug: string
  date: string
  title: string
  excerpt: string
  tags: string[]
  series: string
  part: number
  readingTime?: string
}

export interface SeriesGroup {
  name: string
  posts: SeriesPost[]
  totalParts: number
  latestDate: string
  tags: string[]
  firstPost: SeriesPost
  lastPost: SeriesPost
}

// Drafts (`draft` or `isDraft`) are left out; they have no page to link to.
export function getAllSeries(posts: Post[]): SeriesGroup[] {
  const seriesMap = new Map<string, SeriesPost[]>()
  for (const post of posts) {
    if (!post.series || post.draft || post.isDraft) continue
    const list = seriesMap.get(post.series) ?? []
    list.push({
      slug: post.slug,
      date: new Date(post.date).toISOString(),
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags,
      series: post.series,
      part: post.part || 0,
      readingTime: post.readingTime.text,
    })
    seriesMap.set(post.series, list)
  }

  const groups = [...seriesMap].map(([name, list]): SeriesGroup => {
    const sorted = [...list].sort((a, b) => a.part - b.part)
    const tags = new Set(sorted.flatMap((p) => p.tags))
    return {
      name,
      posts: sorted,
      totalParts: list.length,
      latestDate: list.reduce(
        (latest, p) => (new Date(p.date) > new Date(latest) ? p.date : latest),
        list[0].date
      ),
      tags: [...tags],
      firstPost: sorted[0],
      lastPost: sorted[sorted.length - 1],
    }
  })

  return groups.sort(
    (a, b) =>
      new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
  )
}

export function getSeriesProgress(series: SeriesGroup, currentPart: number) {
  const nextPart = currentPart < series.totalParts ? currentPart + 1 : null
  const prevPart = currentPart > 1 ? currentPart - 1 : null
  return {
    currentPart,
    totalParts: series.totalParts,
    progress: (currentPart / series.totalParts) * 100,
    nextPart: nextPart
      ? series.posts.find((p) => p.part === nextPart)
      : undefined,
    prevPart: prevPart
      ? series.posts.find((p) => p.part === prevPart)
      : undefined,
    isFirst: currentPart === 1,
    isLast: currentPart === series.totalParts,
  }
}
