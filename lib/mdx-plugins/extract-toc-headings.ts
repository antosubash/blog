import { visit } from 'unist-util-visit'

export interface TocHeading {
  value: string
  depth: number
  url: string
}

export function extractTocHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const value = match[2].trim()
      const url =
        '#' +
        value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      headings.push({ value, depth, url })
    }
  }

  return headings
}
