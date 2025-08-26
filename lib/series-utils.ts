import { allPosts } from 'contentlayer/generated'

interface SeriesPost {
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

  // Get all posts that are part of a series
  allPosts
    .filter((post) => post.series && post.isDraft !== true)
    .forEach((post) => {
      const seriesName = post.series!
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, [])
      }
      seriesMap.get(seriesName)?.push({
        slug: post.slug,
        date: post.date,
        title: post.title,
        excerpt: post.excerpt || '',
        tags: post.tags || [],
        series: seriesName,
        part: post.part || 0,
        readingTime:
          typeof post.readingTime === 'object' && post.readingTime && 'text' in post.readingTime
            ? post.readingTime.text
            : undefined,
      })
    })

  // Convert to array and sort posts within each series
  const groups: SeriesGroup[] = Array.from(seriesMap.entries()).map(([name, posts]) => {
    const sortedPosts = posts.sort((a, b) => a.part - b.part)
    const allTags = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => allTags.add(tag)))

    return {
      name,
      posts: sortedPosts,
      totalParts: posts.length,
      latestDate: posts.reduce(
        (latest, post) => (new Date(post.date) > new Date(latest) ? post.date : latest),
        posts[0].date
      ),
      tags: Array.from(allTags),
      firstPost: sortedPosts[0],
      lastPost: sortedPosts[sortedPosts.length - 1],
    }
  })

  return groups.sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime())
}

export function getSeriesByName(seriesName: string): SeriesGroup | undefined {
  return getAllSeries().find((series) => series.name === seriesName)
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
    nextPart: nextPart ? series.posts.find((p) => p.part === nextPart) : null,
    prevPart: prevPart ? series.posts.find((p) => p.part === prevPart) : null,
    isFirst: currentPart === 1,
    isLast: currentPart === series.totalParts,
  }
}
