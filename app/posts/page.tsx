import { genPageMetadata } from 'app/seo'
import { allPosts } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import EnhancedListLayout from '@/layouts/EnhancedListLayout'

const POSTS_PER_PAGE = 8

export const metadata = genPageMetadata({
  title: 'Blog - Anto Subash',
  description:
    'Explore articles on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.',
  keywords: ['blog', 'web development', 'microservices', '.NET', 'React', 'Docker', 'Kubernetes'],
  openGraph: {
    title: 'Blog - Anto Subash',
    description:
      'Explore articles on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.',
    type: 'website',
  },
  twitter: {
    title: 'Blog - Anto Subash',
    description:
      'Explore articles on web development, microservices, .NET, React, Docker, Kubernetes, and modern software development practices.',
  },
})

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allPosts)).filter((post) => !post.draft)
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <EnhancedListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Blog"
    />
  )
}
