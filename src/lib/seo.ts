import siteMetadata from "@/config/siteMetadata"

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  [key: string]: unknown
}

export function genPageMetadata({ title, description, image }: PageSEOProps) {
  const ogImage = image || `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`
  return {
    meta: [
      { title: `${title} | ${siteMetadata.title}` },
      {
        name: "description",
        content: description || siteMetadata.description,
      },
      { property: "og:title", content: `${title} | ${siteMetadata.title}` },
      {
        property: "og:description",
        content: description || siteMetadata.description,
      },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteMetadata.title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${title} | ${siteMetadata.title}` },
      {
        name: "twitter:description",
        content: description || siteMetadata.description,
      },
      { name: "twitter:image", content: ogImage },
    ],
  }
}
