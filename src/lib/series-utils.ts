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
  readingTime?:
    | { text: string; minutes: number; time: number; words: number }
    | string
  [key: string]: unknown
}

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

export function getAllSeries() {
  const seriesMap = new Map<string, SeriesPost[]>()
  for (const post of allPosts as Post[]) {
    if (!post.series || post.isDraft === true) {
      continue
    }

    const seriesName = post.series
    if (!seriesMap.has(seriesName)) {
      seriesMap.set(seriesName, [])
    }

    const seriesPosts = seriesMap.get(seriesName)
    if (seriesPosts) {
      seriesPosts.push({
        slug: post.slug,
        date: new Date(post.date).toISOString(),
        title: post.title,
        excerpt: post.excerpt || "",
        tags: post.tags || [],
        series: seriesName,
        part: post.part || 0,
        readingTime:
          typeof post.readingTime === "object" &&
          post.readingTime &&
          "text" in post.readingTime
            ? post.readingTime.text
            : undefined,
      })
    }
  }

  const groups: SeriesGroup[] = Array.from(seriesMap.entries()).map(
    ([name, posts]: [string, SeriesPost[]]) => {
      const sortedPosts = posts.sort(
        (a: SeriesPost, b: SeriesPost) => a.part - b.part
      )
      const allTags = new Set<string>()
      for (const post of posts) {
        for (const tag of post.tags) {
          allTags.add(tag)
        }
      }

      return {
        name,
        posts: sortedPosts,
        totalParts: posts.length,
        latestDate: posts.reduce(
          (latest: string, post: SeriesPost) =>
            new Date(post.date) > new Date(latest) ? post.date : latest,
          posts[0].date
        ),
        tags: Array.from(allTags),
        firstPost: sortedPosts[0],
        lastPost: sortedPosts[sortedPosts.length - 1],
      }
    }
  )

  return groups.sort(
    (a: SeriesGroup, b: SeriesGroup) =>
      new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
  )
}

export function getSeriesByName(seriesName: string): SeriesGroup | undefined {
  return getAllSeries().find(
    (series: SeriesGroup) => series.name === seriesName
  )
}

export function getSeriesProgress(seriesName: string, currentPart: number) {
  const series = getSeriesByName(seriesName)
  if (!series) return null

  const progress = (currentPart / series.totalParts) * 100
  const nextPart = currentPart < series.totalParts ? currentPart + 1 : null
  const prevPart = currentPart > 1 ? currentPart - 1 : null

  return {
    currentPart,
    totalParts: series.totalParts,
    progress,
    nextPart: nextPart
      ? series.posts.find((p: SeriesPost) => p.part === nextPart)
      : null,
    prevPart: prevPart
      ? series.posts.find((p: SeriesPost) => p.part === prevPart)
      : null,
    isFirst: currentPart === 1,
    isLast: currentPart === series.totalParts,
  }
}
