export interface TocItem {
  value: string
  url: string
  depth: number
}

export interface TocSection extends TocItem {
  children: TocItem[]
}

/** Builds the post TOC (h2-h4) from Astro's rendered headings. */
export function headingsToToc(
  headings: { depth: number; slug: string; text: string }[]
): TocItem[] {
  return headings
    .filter((h) => h.depth >= 2 && h.depth <= 4)
    .map((h) => ({ value: h.text, url: `#${h.slug}`, depth: h.depth }))
}

/** Groups h3/h4 entries under the h2 they follow (entries before the first h2 are dropped, as before). */
export function groupToc(toc: TocItem[]): TocSection[] {
  const sections: TocSection[] = []
  for (const item of toc) {
    if (item.depth === 2) sections.push({ ...item, children: [] })
    else sections.at(-1)?.children.push(item)
  }
  return sections
}
