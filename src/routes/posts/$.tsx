import { components } from "@/components/MDXComponents"
import MDXRenderer from "@/components/MDXRenderer"
import PostEnhancements from "@/components/PostEnhancements"
import SectionContainer from "@/components/SectionContainer"
import RelatedPost from "@/components/related-posts"
import siteMetadata from "@/config/siteMetadata"
import PostBanner from "@/layouts/PostBanner"
import PostLayout from "@/layouts/PostLayout"
import PostSimple from "@/layouts/PostSimple"
import { getRelatedPosts } from "@/lib/tag-utils"
import { createFileRoute } from "@tanstack/react-router"
import {
  type Author,
  type Post,
  allAuthors,
  allPosts,
} from "content-collections"
import type { ComponentType, ReactNode } from "react"

const defaultLayout = "PostSimple"
type LayoutComponent = ComponentType<{
  content: Post
  authorDetails?: typeof allAuthors
  next?: { postUrl: string; title: string }
  prev?: { postUrl: string; title: string }
  children: ReactNode
}>

const layouts: Record<string, LayoutComponent> = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export const Route = createFileRoute("/posts/$")({
  component: PostPage,
  head: ({ params }) => {
    const slug = params._splat || ""
    const post = allPosts.find((p) => p.slug === slug)
    if (!post) {
      return { meta: [{ title: "Post Not Found" }] }
    }

    const ogImage = post.images?.[0] || `/og/${post.slug}.png`
    const ogImageUrl = ogImage.startsWith("http")
      ? ogImage
      : `${siteMetadata.siteUrl}${ogImage}`

    return {
      meta: [
        { title: `${post.title} | ${siteMetadata.title}` },
        { name: "description", content: post.excerpt || "" },
        { name: "keywords", content: post.tags?.join(", ") || "" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt || "" },
        { property: "og:image", content: ogImageUrl },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `${siteMetadata.siteUrl}/posts/${post.slug}`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt || "" },
        { name: "twitter:image", content: ogImageUrl },
      ],
    }
  },
})

function PostPage() {
  const params = Route.useParams()
  const slug = params._splat || ""

  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <SectionContainer>
        <div className="py-20 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Post Not Found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The post you're looking for doesn't exist.
          </p>
        </div>
      </SectionContainer>
    )
  }

  const sortedPosts = [...allPosts]
    .filter((p) => !p.draft && !p.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = sortedPosts[postIndex + 1]
  const next = sortedPosts[postIndex - 1]

  const authorList = post.authors || ["default"]
  const fallbackAuthor: Author = {
    name: "Default Author",
    avatar: null,
    occupation: null,
    company: null,
    email: null,
    twitter: null,
    linkedin: null,
    github: null,
    layout: null,
    mdx: "",
    slug: "default",
    path: "authors/default",
    filePath: "content/authors/default.mdx",
  }
  const authorDetails = authorList.map((author: string) => {
    const authorResult = allAuthors.find((a) => a.slug === author)
    return authorResult || fallbackAuthor
  })

  const Layout = layouts[post.layout || defaultLayout]
  const relatedPosts = getRelatedPosts(post.slug)

  const mainContent = {
    ...post,
    date: new Date(post.date).toISOString(),
    postUrl: post.postUrl,
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: authorDetails.map((author: { name: string }) => ({
      "@type": "Person",
      name: author.name,
    })),
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.lastmod || post.date).toISOString(),
    image: post.images?.[0] || `/og/${post.slug}.png`,
    url: `${siteMetadata.siteUrl}/posts/${post.slug}`,
  }

  return (
    <>
      {/* JSON-LD structured data for SEO - content is from our own post metadata, not user input */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next ? { postUrl: next.postUrl, title: next.title } : undefined}
        prev={prev ? { postUrl: prev.postUrl, title: prev.title } : undefined}
      >
        <PostEnhancements tags={post.tags} />

        <MDXRenderer
          code={post.mdx}
          components={components}
          toc={post.toc}
          slug={post.slug}
          videoId={post.videoId ?? undefined}
          series={post.series ?? undefined}
        />

        <RelatedPost posts={relatedPosts} />
      </Layout>
    </>
  )
}
