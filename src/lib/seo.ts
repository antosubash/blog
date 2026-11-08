import siteMetadata from "@/config/siteMetadata"

export interface MetaTag {
  name?: string
  property?: string
  content: string
}

export interface PageMeta {
  title: string
  description: string
  tags: MetaTag[]
}

/** Head for pages that set nothing (tag and pagination pages), as before. */
export const defaultPageMeta: PageMeta = {
  title: "Anto Subash - Blog",
  description:
    "Full-stack developer passionate about web technologies, microservices, and modern software development.",
  tags: [],
}

export function genPageMetadata({
  title,
  description,
  image,
}: {
  title: string
  description?: string
  image?: string
}): PageMeta {
  const ogImage = image || `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`
  const fullTitle = `${title} | ${siteMetadata.title}`
  const desc = description || siteMetadata.description
  return {
    title: fullTitle,
    description: desc,
    tags: [
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: desc },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteMetadata.title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: ogImage },
    ],
  }
}

export function genPostMetadata(post: {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  images: string[]
}): PageMeta {
  const ogImage = post.images[0] || `/og/${post.slug}.png`
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${siteMetadata.siteUrl}${ogImage}`
  return {
    title: `${post.title} | ${siteMetadata.title}`,
    description: post.excerpt,
    tags: [
      { name: "keywords", content: post.tags.join(", ") },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.excerpt },
      { property: "og:image", content: ogImageUrl },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: `${siteMetadata.siteUrl}/posts/${post.slug}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.excerpt },
      { name: "twitter:image", content: ogImageUrl },
    ],
  }
}
