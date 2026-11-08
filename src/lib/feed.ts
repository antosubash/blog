import siteMetadata from "@/config/siteMetadata"
import rss from "@astrojs/rss"
import type { Post } from "./post-types"

const siteDescription =
  "Full-stack developer passionate about web technologies, microservices, and modern software development."

function buildFeed(posts: Post[], title: string, feedPath: string) {
  return rss({
    title,
    description: siteDescription,
    site: siteMetadata.siteUrl,
    // Keep item links and guids exactly as before (no trailing slash).
    trailingSlash: false,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      "<language>en-us</language>",
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<atom:link href="${siteMetadata.siteUrl}/${feedPath}" rel="self" type="application/rss+xml"/>`,
    ].join(""),
    items: posts.map((post) => ({
      title: post.title,
      link: post.postUrl,
      pubDate: new Date(post.date),
      description: post.excerpt,
    })),
  })
}

export const feedResponse = (posts: Post[]) =>
  buildFeed(posts, siteMetadata.title, "feed.xml")

export const tagFeedResponse = (tag: string, posts: Post[]) =>
  buildFeed(posts, `${siteMetadata.title} - ${tag}`, `tags/${tag}/feed.xml`)
