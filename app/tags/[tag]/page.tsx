import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import EnhancedListLayout from '@/layouts/EnhancedListLayout'
import { getAllPosts } from '@/lib/mdx'
import { getTagsWithCount } from '@/lib/tag-utils'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURI(tag)
  const ogImage = siteMetadata.siteUrl + '/og/' + decodedTag + '.png'
  const title = decodedTag[0].toUpperCase() + decodedTag.split(' ').join('-').slice(1)

  return genPageMetadata({
    title: `${title} - Anto Subash`,
    description: `Explore articles tagged with ${decodedTag} on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.`,
    keywords: [
      decodedTag,
      'blog',
      'web development',
      'microservices',
      '.NET',
      'React',
      'Docker',
      'Kubernetes',
    ],
    image: ogImage,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${decodedTag}/feed.xml`,
      },
    },
    openGraph: {
      title: `${title} - Anto Subash`,
      description: `Explore articles tagged with ${decodedTag} on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.`,
      type: 'website',
    },
    twitter: {
      title: `${title} - Anto Subash`,
      description: `Explore articles tagged with ${decodedTag} on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.`,
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = await getTagsWithCount()
  const paths = tagCounts.map((tagWithCount) => ({
    tag: encodeURI(tagWithCount.tag),
    count: tagWithCount.count,
  }))
  return paths
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const decodedTag = decodeURI(tag)
  // Capitalize first letter and convert space to dash
  const title = decodedTag[0].toUpperCase() + decodedTag.split(' ').join('-').slice(1)
  const allPosts = await getAllPosts()
  const filteredPosts = allPosts
    .filter(
      (post) =>
        post.tags &&
        post.tags
          .filter((t) => t)
          .map((t) => slug(t))
          .includes(decodedTag)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const tagsWithCount = await getTagsWithCount()
  return (
    <EnhancedListLayout
      posts={filteredPosts}
      title={`${title} Articles`}
      tagsWithCount={tagsWithCount}
    />
  )
}
