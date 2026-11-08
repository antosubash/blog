import { describe, expect, it } from "vitest"
import { engagements, practiceAreas } from "../../config/consultingData"
import { featuredProjects } from "../../config/projectsData"
import { postsForTags } from "../consulting"
import { post } from "./fixtures"

describe("postsForTags", () => {
  const posts = [
    post({ slug: "abp-old", tags: ["abp"], date: "2021-01-01T00:00:00.000Z" }),
    post({ slug: "abp-new", tags: ["ABP"], date: "2025-01-01T00:00:00.000Z" }),
    post({
      slug: "k8s",
      tags: ["kubernetes"],
      date: "2024-01-01T00:00:00.000Z",
    }),
    post({ slug: "draft", tags: ["abp"], draft: true }),
    post({ slug: "is-draft", tags: ["abp"], isDraft: true }),
    post({ slug: "other", tags: ["css"] }),
  ]

  it("matches any tag, case-insensitively, newest first, without drafts", () => {
    const { count, posts: found } = postsForTags(posts, ["abp", "Kubernetes"])
    expect(count).toBe(3)
    expect(found.map((p) => p.slug)).toEqual(["abp-new", "k8s", "abp-old"])
  })

  it("caps the list but counts every match", () => {
    const { count, posts: found } = postsForTags(
      posts,
      ["abp", "kubernetes"],
      1
    )
    expect(count).toBe(3)
    expect(found.map((p) => p.slug)).toEqual(["abp-new"])
  })

  it("returns nothing for an empty tag list", () => {
    expect(postsForTags(posts, [])).toEqual({ count: 0, posts: [] })
  })
})

describe("consultingData", () => {
  it("links only to featured projects that exist", () => {
    const known = new Set(featuredProjects.map((p) => p.slug))
    for (const area of practiceAreas) {
      for (const slug of area.projects ?? []) expect(known).toContain(slug)
    }
  })

  it("has unique area slugs and complete entries", () => {
    const slugs = practiceAreas.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const area of practiceAreas)
      expect(area.helpWith.length).toBeGreaterThan(0)
    for (const e of engagements) expect(e.youGet.length).toBeGreaterThan(0)
  })
})
