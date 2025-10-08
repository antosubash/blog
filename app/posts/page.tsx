import EnhancedListLayout from '@/layouts/EnhancedListLayout'
import { getAllPosts } from '@/lib/mdx'
import { getTagsWithCount } from '@/lib/tag-utils'
import { genPageMetadata } from 'app/seo'

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

export default async function BlogPage() {
  const allPosts = await getAllPosts()
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }
  const tagsWithCount = await getTagsWithCount()

  return (
    <EnhancedListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Blog"
      tagsWithCount={tagsWithCount}
    />
  )
}
