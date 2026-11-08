import { loadRenderers } from "astro:container"
import { getCollection, render } from "astro:content"
import { getContainerRenderer } from "@astrojs/mdx/container-renderer"
import { experimental_AstroContainer as AstroContainer } from "astro/container"
import { toFeedHtml } from "./feed-html"
import { mdxComponents } from "./mdx-components"
import type { Post } from "./post-types"

/**
 * Full HTML of each post for `content:encoded`, rendered with the Astro
 * container API (the same MDX components as the post page) and made feed-safe.
 */
export async function renderFeedContent(
  posts: Post[],
  siteUrl: string
): Promise<Map<string, string>> {
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  })
  const entries = new Map(
    (await getCollection("posts")).map((e) => [e.id, e] as const)
  )
  const out = new Map<string, string>()
  for (const post of posts) {
    const entry = entries.get(post.slug)
    if (!entry) continue
    const { Content } = await render(entry)
    const html = await container.renderToString(Content, {
      props: { components: mdxComponents },
    })
    // The post page embeds the video above the body; feeds get a link.
    const video = post.videoId
      ? `<p><a href="https://www.youtube.com/watch?v=${encodeURIComponent(post.videoId)}">Watch the video on YouTube</a></p>`
      : ""
    out.set(post.slug, toFeedHtml(video + html, `${siteUrl}${post.postUrl}`))
  }
  return out
}
