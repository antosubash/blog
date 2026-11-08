import type { Post } from "../post-types"

export function post(overrides: Partial<Post> & { slug: string }): Post {
  return {
    title: overrides.slug,
    date: "2024-01-01T00:00:00.000Z",
    lastmod: null,
    tags: [],
    draft: false,
    isDraft: false,
    excerpt: "",
    videoId: null,
    series: null,
    part: null,
    images: [],
    authors: [],
    layout: null,
    canonicalUrl: null,
    readingTime: { text: "1 min read", minutes: 1, time: 60000, words: 200 },
    filePath: `content/posts/${overrides.slug}.mdx`,
    postUrl: `/posts/${overrides.slug}`,
    ...overrides,
  }
}
