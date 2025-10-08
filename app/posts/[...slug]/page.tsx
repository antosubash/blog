import 'css/prism.css'
import 'katex/dist/katex.css'
import { components } from '@/components/MDXComponents'
import CustomTOCInline from '@/components/CustomTOCInline'

import { getAllPosts, getAllAuthors, getPostBySlug, type Post, type Author } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
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
  const allPosts = await getAllPosts()
  const post = allPosts.find((p) => p.slug === decodedSlug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  const authorList = post?.authors || ['default']
  const allAuthorsData = getAllAuthors()
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthorsData.find((p) => p.slug === author)
    return authorResults
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.filter((author) => author).map((author) => author!.name)

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
  const allPosts = await getAllPosts()
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

  const post = await getPostBySlug(decodedSlug)

  if (!post || (process.env.NODE_ENV === 'production' && post.draft)) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const sortedPosts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const postIndex = sortedPosts.findIndex((p) => p.slug === decodedSlug)

  if (postIndex === -1) {
    notFound()
  }

  const prev = sortedPosts[postIndex + 1]
  const next = sortedPosts[postIndex - 1]

  const authorList = post?.authors || ['default']
  const allAuthorsData = getAllAuthors()
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthorsData.find((p) => p.slug === author)
    return authorResults
  })

  const mainContent = post

  // Enhanced structured data
  const jsonLd = {
    ...post.structuredData,
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: authorDetails
      .filter((author) => author)
      .map((author) => ({
        '@type': 'Person',
        name: author!.name,
        url: author!.twitter
          ? `https://twitter.com/${author!.twitter.replace('https://twitter.com/', '')}`
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
    wordCount: undefined,
    timeRequired: post.readingTime?.text,
  }

  const Layout = layouts[post.layout || defaultLayout]
  const relatedPosts = await getRelatedPosts(post.slug)

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
        <div className="mdx-content">
          {/* Series information */}
          {post.series && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h3 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                Series: {post.series}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                This post is part of the {post.series} series.
              </p>
            </div>
          )}

          {/* Video embed if videoId is provided */}
          {post.videoId && (
            <div className="mb-8">
              <div className="relative h-0 w-full pb-[56.25%]">
                <iframe
                  className="absolute left-0 top-0 h-full w-full rounded-lg"
                  src={`https://www.youtube.com/embed/${post.videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Table of Contents */}
          {post.toc && (
            <div className="mb-8">
              <CustomTOCInline toc={post.toc} />
            </div>
          )}

          {/* Main MDX content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {post.content ? (
              <MDXRemote source={post.content} components={components} />
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
                  Content Error
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  Unable to load the post content. Please try refreshing the page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        <Suspense fallback={<div className="my-8 h-32 animate-pulse rounded bg-gray-100"></div>}>
          <RelatedPost posts={relatedPosts} />
        </Suspense>
      </Layout>
    </>
  )
}
