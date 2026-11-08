import { describe, expect, it } from "vitest"
import { relatedPosts } from "../projects"
import { post } from "./fixtures"

const entry = (slug: string, body: string, extra = {}) => ({
  post: post({ slug, ...extra }),
  body,
})

describe("relatedPosts", () => {
  const posts = [
    entry("old", "see https://github.com/antosubash/AbpReact for code", {
      date: "2022-01-01T00:00:00.000Z",
    }),
    entry("new", "clone https://github.com/antosubash/abp-react.git", {
      date: "2026-01-01T00:00:00.000Z",
    }),
    entry("tanstack", "https://github.com/antosubash/abp-react-tanstack", {
      date: "2026-05-01T00:00:00.000Z",
    }),
    entry(
      "prose-end",
      "Code lives at https://github.com/antosubash/abp-react.",
      {
        date: "2023-01-01T00:00:00.000Z",
      }
    ),
    entry("draft", "https://github.com/antosubash/abp-react", { draft: true }),
    entry("unrelated", "https://github.com/someone/abp-react"),
    entry(
      "sub-path",
      "[x](https://github.com/antosubash/abp-react/tree/main/src)",
      {
        date: "2025-01-01T00:00:00.000Z",
      }
    ),
  ]

  it("matches current names and aliases, case-insensitively, newest first", () => {
    const slugs = relatedPosts(["antosubash/abp-react", "AbpReact"], posts).map(
      (p) => p.slug
    )
    expect(slugs).toEqual(["new", "sub-path", "prose-end"])
  })

  it("does not match a longer repo name that starts with the same prefix", () => {
    const slugs = relatedPosts(["antosubash/abp-react"], posts, 10).map(
      (p) => p.slug
    )
    expect(slugs).not.toContain("tanstack")
  })

  it("skips drafts and other owners, and caps the result", () => {
    const slugs = relatedPosts(
      ["antosubash/abp-react", "AbpReact"],
      posts,
      1
    ).map((p) => p.slug)
    expect(slugs).toEqual(["new"])
  })

  it("puts pinned posts first, skips unknown or draft pins, then fills with matches", () => {
    const slugs = relatedPosts(["antosubash/abp-react", "AbpReact"], posts, 3, [
      "old",
      "missing",
      "draft",
    ]).map((p) => p.slug)
    expect(slugs).toEqual(["old", "new", "sub-path"])
  })
})
