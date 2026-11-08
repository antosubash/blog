import { type CollectionEntry, getCollection } from "astro:content"
import readingTime from "reading-time"
import type { Post } from "./post-types"

export type { Post } from "./post-types"

function toPost(entry: CollectionEntry<"posts">): Post {
  const { data } = entry
  const rt = readingTime(entry.body ?? "")
  return {
    slug: entry.id,
    title: data.title,
    date: data.date.toISOString(),
    lastmod: data.lastmod ? data.lastmod.toISOString() : null,
    tags: data.tags,
    draft: data.draft ?? false,
    isDraft: data.isDraft ?? false,
    excerpt: data.excerpt ?? "",
    videoId: data.videoId ?? null,
    series: data.series ?? null,
    part: data.part ?? null,
    images: data.images ?? [],
    authors: data.authors ?? [],
    layout: data.layout ?? null,
    readingTime: {
      text: rt.text,
      minutes: rt.minutes,
      time: rt.time,
      words: rt.words,
    },
    filePath: entry.filePath ?? `content/posts/${entry.id}.mdx`,
    postUrl: `/posts/${entry.id}`,
  }
}

let cache: Promise<Post[]> | undefined

/**
 * Every post, drafts included, ordered by source path. Collection order is not
 * deterministic; the path order keeps tag listings stable (and as before).
 */
export function getAllPosts(): Promise<Post[]> {
  cache ??= getCollection("posts").then((entries) =>
    entries
      .map(toPost)
      .sort((a, b) =>
        a.filePath < b.filePath ? -1 : a.filePath > b.filePath ? 1 : 0
      )
  )
  return cache
}

export const isPublished = (post: Pick<Post, "draft" | "isDraft">) =>
  !post.draft && !post.isDraft

export const byDateDesc = (a: Post, b: Post) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter(isPublished).sort(byDateDesc)
}

export async function getPostEntry(slug: string) {
  const entries = await getCollection("posts")
  return entries.find((e) => e.id === slug)
}
