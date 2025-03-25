import 'css/prism.css'
import 'katex/dist/katex.css'
import { components } from '@/components/MDXComponents'
import CustomMDXLayoutRenderer from '@/components/CustomMDXLayoutRenderer'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allAuthors, allPosts } from 'contentlayer/generated'
import type { Authors, Posts } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getRelatedPosts } from '@/lib/tag-utils'
import RelatedPost from '@/components/related-posts'
import PostEnhancements from '@/components/PostEnhancements'
import { Suspense } from 'react'

const defaultLayout = 'PostSimple'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const decodedSlug = decodeURI(slug.join('/'))
  const post = allPosts.find((p) => p.slug === decodedSlug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)

  // Enhanced OG image handling
  const ogImage = post.images?.[0] || `/og/${post.slug}.png`
  const imageList = post.images || [ogImage]
  const ogImages = imageList.map((img) => ({
    url: img.startsWith('http') ? img : `${siteMetadata.siteUrl}${img}`,
    width: 1200,
    height: 630,
    alt: post.title,
  }))

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    creator: authors[0] || siteMetadata.author,
    publisher: siteMetadata.title,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}/posts/${post.slug}`,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ogImages[0]?.url,
      creator: authors[0] || siteMetadata.author,
      site: siteMetadata.twitter,
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/posts/${post.slug}`,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allPosts.filter((post) => !post.draft).map((p) => ({ slug: p.slug.split('/') }))
  return paths
}

function PostLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-8 h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="space-y-4">
        <div className="h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        <div className="h-4 w-4/6 rounded bg-gray-200"></div>
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const decodedSlug = decodeURI(slug.join('/'))

  const post = allPosts.find((p) => p.slug === decodedSlug)

  if (!post || (process.env.NODE_ENV === 'production' && post.draft)) {
    notFound()
  }

  const sortedCoreContents = allCoreContent(sortPosts(allPosts.filter((post) => !post.draft)))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === decodedSlug)

  if (postIndex === -1) {
    notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const mainContent = coreContent(post)

  // Enhanced structured data
  const jsonLd = {
    ...post.structuredData,
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: author.twitter
        ? `https://twitter.com/${author.twitter.replace('https://twitter.com/', '')}`
        : undefined,
    })),
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}/static/images/logo.png`,
      },
    },
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    image: post.images?.[0] || `/og/${post.slug}.png`,
    url: `${siteMetadata.siteUrl}/posts/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/posts/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.tags?.[0],
    wordCount: post.body.raw.length,
    timeRequired: post.readingTime
      ? typeof post.readingTime === 'string'
        ? post.readingTime
        : `${Math.ceil(post.readingTime.minutes)}M${post.readingTime.seconds}S`
      : undefined,
  }

  const Layout = layouts[post.layout || defaultLayout]
  const relatedPosts = getRelatedPosts(post.slug)

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteMetadata.siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${siteMetadata.siteUrl}/posts`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `${siteMetadata.siteUrl}/posts/${post.slug}`,
              },
            ],
          }),
        }}
      />

      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        {/* Post Enhancements */}
        <PostEnhancements
          slug={post.slug}
          title={post.title}
          readingTime={post.readingTime}
          tags={post.tags}
        />

        {/* Main Content */}
        <Suspense fallback={<PostLoading />}>
          <CustomMDXLayoutRenderer
            code={post.body.code}
            components={components}
            toc={post.toc}
            slug={post.slug}
            videoId={post.videoId}
            series={post.series}
          />
        </Suspense>

        {/* Related Posts */}
        <Suspense fallback={<div className="my-8 h-32 animate-pulse rounded bg-gray-100"></div>}>
          <RelatedPost posts={relatedPosts} />
        </Suspense>
      </Layout>
    </>
  )
}
