import EnhancedPagination from "@/components/EnhancedPagination"
import PostSearch from "@/components/PostSearch"
import Tag from "@/components/Tag"
import PostItem from "@/components/post-item"
import type { PostListItem } from "@/lib/post-types"
import { useMemo, useState } from "react"

/** /posts and /posts/page/N */
export const POSTS_PER_PAGE = 8
/** Lists paginated in the browser (tag pages) */
const CLIENT_POSTS_PER_PAGE = 10

interface EnhancedListLayoutProps {
  posts: PostListItem[]
  title: string
  /** Server pagination (/posts/page/N). Without it the list paginates in the browser. */
  pagination?: { totalPages: number; currentPage: number }
  basePath?: string
}

export default function EnhancedListLayout({
  posts,
  title,
  pagination,
  basePath = "posts",
}: EnhancedListLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [clientPage, setClientPage] = useState(1)

  const isClientPaginated = !pagination

  const updateSearchQuery = (query: string) => {
    // PostSearch re-reports the (debounced) query after every render; only a
    // real change may reset the page, or "Next" bounces back to page 1.
    if (query === searchQuery) return
    setSearchQuery(query)
    if (isClientPaginated) setClientPage(1)
  }

  const updateSelectedTags = (tags: string[]) => {
    setSelectedTags(tags)
    if (isClientPaginated) setClientPage(1)
  }

  const availableTags = useMemo(() => {
    const allTags = new Set<string>()
    for (const post of posts) {
      for (const tag of post.tags) {
        if (tag) allTags.add(tag)
      }
    }
    return Array.from(allTags).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = posts
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag?.toLowerCase().includes(query))
      )
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) => post.tags.filter(Boolean).includes(tag))
      )
    }
    return filtered
  }, [posts, searchQuery, selectedTags])

  const currentPage = isClientPaginated
    ? clientPage
    : pagination?.currentPage || 1
  const pageSize = isClientPaginated ? CLIENT_POSTS_PER_PAGE : POSTS_PER_PAGE
  const totalPages = Math.ceil(filteredPosts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const displayPosts = filteredPosts.slice(startIndex, startIndex + pageSize)
  const hasActiveFilters = searchQuery || selectedTags.length > 0

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {hasActiveFilters
            ? `${filteredPosts.length} of ${posts.length} posts`
            : `${posts.length} articles`}
        </p>
      </div>

      <div className="mb-8">
        <PostSearch
          onSearch={updateSearchQuery}
          onTagFilter={updateSelectedTags}
          availableTags={availableTags}
          selectedTags={selectedTags}
        />
      </div>

      {selectedTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          {selectedTags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      )}

      {displayPosts.length > 0 ? (
        <div className="divide-y divide-border">
          {displayPosts.map((post) => (
            <PostItem
              key={post.slug}
              slug={post.slug}
              date={post.date}
              title={post.title}
              summary={post.excerpt}
              tags={post.tags}
              series={post.series ?? undefined}
              part={post.part ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No posts found.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setSelectedTags([])
            }}
            className="mt-4 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
          >
            Clear filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <EnhancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
            onPageChange={isClientPaginated ? setClientPage : undefined}
          />
        </div>
      )}
    </div>
  )
}
