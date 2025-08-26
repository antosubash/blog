import { allPosts } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import EnhancedListLayout from '@/layouts/EnhancedListLayout'

const POSTS_PER_PAGE = 8

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const posts = allCoreContent(sortPosts(allPosts)).filter((post) => !post.draft)
  const pageNumber = parseInt(page as string)
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
