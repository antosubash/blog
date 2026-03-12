import { createFileRoute } from "@tanstack/react-router"
import { allPosts } from "content-collections"
import EnhancedListLayout from "@/layouts/EnhancedListLayout"

const POSTS_PER_PAGE = 8

export const Route = createFileRoute("/posts/page/$page")({
  component: PaginatedBlogPage,
})

function PaginatedBlogPage() {
  const { page } = Route.useParams()
  const pageNumber = parseInt(page)

  const posts = [...allPosts]
    .filter((post) => !post.draft && !post.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      ...post,
      date: new Date(post.date).toISOString(),
    }))

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
