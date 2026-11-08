import { describe, expect, it } from "vitest"
import {
  getPostsForTagPage,
  getRelatedPosts,
  getTagFeeds,
  getTagPageParams,
  getTagsWithCount,
  tagPageTitle,
} from "../tag-utils"
import { post } from "./fixtures"

const posts = [
  post({ slug: "a", date: "2024-01-03T00:00:00Z", tags: ["dotnet", "Llama"] }),
  post({ slug: "b", date: "2024-01-02T00:00:00Z", tags: ["dotnet", ""] }),
  post({ slug: "c", date: "2024-01-01T00:00:00Z", tags: ["react"] }),
  post({ slug: "d", tags: ["dotnet"], draft: true }),
]

describe("tag utils", () => {
  it("counts published tags, most used first", () => {
    expect(getTagsWithCount(posts)).toEqual([
      { tag: "dotnet", count: 2 },
      { tag: "Llama", count: 1 },
      { tag: "react", count: 1 },
    ])
  })

  it("builds pages for tag slugs and raw tag text", () => {
    expect(getTagPageParams(posts).sort()).toEqual(
      ["Llama", "dotnet", "llama", "react"].sort()
    )
  })

  it("lists posts whose tag slug matches, newest first", () => {
    expect(getPostsForTagPage(posts, "dotnet").map((p) => p.slug)).toEqual([
      "a",
      "b",
    ])
    expect(getPostsForTagPage(posts, "llama").map((p) => p.slug)).toEqual(["a"])
    // Raw-case URL matches nothing, as on the previous site.
    expect(getPostsForTagPage(posts, "Llama")).toEqual([])
  })

  it("titles tag pages", () => {
    expect(tagPageTitle("abp")).toBe("Abp Articles")
  })

  it("groups tag feeds by lower-cased tag", () => {
    const feeds = getTagFeeds(posts)
    expect([...feeds.keys()].sort()).toEqual(["dotnet", "llama", "react"])
    expect(feeds.get("dotnet")?.map((p) => p.slug)).toEqual(["a", "b"])
  })

  it("relates posts by series first, then shared tags", () => {
    expect(getRelatedPosts(posts, "a").map((p) => p.slug)).toEqual(["b"])
    const series = [
      post({ slug: "s1", series: "S", date: "2024-01-01T00:00:00Z" }),
      post({ slug: "s2", series: "S", date: "2024-02-01T00:00:00Z" }),
      post({ slug: "x", tags: ["t"] }),
    ]
    expect(getRelatedPosts(series, "s1").map((p) => p.slug)).toEqual(["s2"])
  })
})
