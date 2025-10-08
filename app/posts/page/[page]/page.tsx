import EnhancedListLayout from '@/layouts/EnhancedListLayout'
import { getAllPosts } from '@/lib/mdx'
import { getTagsWithCount } from '@/lib/tag-utils'

const POSTS_PER_PAGE = 8

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts()
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const allPosts = await getAllPosts()
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const pageNumber = parseInt(page as string)
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
