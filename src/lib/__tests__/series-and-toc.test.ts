import { describe, expect, it } from "vitest"
import { getVisiblePages } from "../../components/EnhancedPagination"
import { linkAttrs } from "../link"
import { getAllSeries, getSeriesProgress } from "../series-utils"
import { groupToc, headingsToToc } from "../toc"
import { post } from "./fixtures"

describe("series", () => {
  const posts = [
    post({ slug: "p2", series: "S", part: 2, date: "2024-02-01T00:00:00Z" }),
    post({ slug: "p1", series: "S", part: 1, date: "2024-01-01T00:00:00Z" }),
    post({ slug: "hidden", series: "S", part: 3, isDraft: true }),
    post({ slug: "solo" }),
  ]

  it("groups posts by series in part order", () => {
    const [s] = getAllSeries(posts)
    expect(s.name).toBe("S")
    expect(s.posts.map((p) => p.slug)).toEqual(["p1", "p2"])
    expect(s.latestDate).toBe("2024-02-01T00:00:00.000Z")
  })

  it("reports progress and neighbours", () => {
    const [s] = getAllSeries(posts)
    const progress = getSeriesProgress(s, 1)
    expect(progress.progress).toBe(50)
    expect(progress.nextPart?.slug).toBe("p2")
    expect(progress.prevPart).toBeUndefined()
  })
})

describe("toc", () => {
  it("keeps h2-h4 and groups them under h2", () => {
    const toc = headingsToToc([
      { depth: 1, slug: "title", text: "Title" },
      { depth: 2, slug: "a", text: "A" },
      { depth: 3, slug: "a1", text: "A1" },
      { depth: 5, slug: "deep", text: "Deep" },
      { depth: 2, slug: "b", text: "B" },
    ])
    expect(toc.map((t) => t.url)).toEqual(["#a", "#a1", "#b"])
    expect(groupToc(toc).map((s) => [s.value, s.children.length])).toEqual([
      ["A", 1],
      ["B", 0],
    ])
  })
})

describe("links", () => {
  it("opens external links and files in a new tab", () => {
    expect(linkAttrs("/posts/x")).toEqual({})
    expect(linkAttrs("#top")).toEqual({})
    expect(linkAttrs("/feed.xml").target).toBe("_blank")
    expect(linkAttrs("https://example.com").target).toBe("_blank")
  })
})

describe("pagination", () => {
  it("shows a window of pages with ellipses", () => {
    expect(getVisiblePages(1, 9)).toEqual([1, 2, 3, 4, 5, "...", 9])
    expect(getVisiblePages(5, 9)).toEqual([1, "...", 3, 4, 5, 6, 7, "...", 9])
    expect(getVisiblePages(9, 9)).toEqual([1, "...", 5, 6, 7, 8, 9])
  })
})
