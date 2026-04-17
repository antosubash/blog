import EnhancedPagination from "@/components/EnhancedPagination"
import PostSearch from "@/components/PostSearch"
import Tag from "@/components/Tag"
import PostItem from "@/components/post-item"
import type { Post } from "content-collections"
import { useMemo, useState } from "react"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface EnhancedListLayoutProps {
  posts: Post[]
  title: string
  initialDisplayPosts?: Post[]
  pagination?: PaginationProps
}

export default function EnhancedListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: EnhancedListLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [clientPage, setClientPage] = useState(1)

  const isClientPaginated = !pagination

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
    if (isClientPaginated) {
      setClientPage(1)
    }
  }

  const updateSelectedTags = (tags: string[]) => {
    setSelectedTags(tags)
    if (isClientPaginated) {
      setClientPage(1)
    }
  }

  const availableTags = useMemo(() => {
    const allTags = new Set<string>()
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
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
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag: string) => tag?.toLowerCase().includes(query))
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) =>
          post.tags?.filter((t: string) => t).includes(tag)
        )
      )
    }

    return filtered
  }, [posts, searchQuery, selectedTags])

  const POSTS_PER_PAGE = 10
  const currentPage = isClientPaginated
    ? clientPage
    : pagination?.currentPage || 1
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const currentPagePosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  )

  const displayPosts =
    initialDisplayPosts.length > 0 &&
    currentPage === 1 &&
    !searchQuery &&
    selectedTags.length === 0
      ? initialDisplayPosts
      : currentPagePosts

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
          {displayPosts
            .map((post) => {
              if (!post.slug || !post.title || !post.date) return null

              let safeReadingTime: string | undefined
              if (typeof post.readingTime === "string") {
                safeReadingTime = post.readingTime
              } else if (
                post.readingTime &&
                typeof post.readingTime === "object" &&
                "text" in post.readingTime
              ) {
                safeReadingTime = post.readingTime.text
              }

              return (
                <PostItem
                  key={post.path}
                  slug={post.slug}
                  date={post.date}
                  title={post.title}
                  summary={post.excerpt || ""}
                  tags={post.tags || []}
                  series={post.series ?? undefined}
                  part={post.part ?? undefined}
                  readingTime={safeReadingTime}
                />
              )
            })
            .filter(Boolean)}
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
            onPageChange={isClientPaginated ? setClientPage : undefined}
          />
        </div>
      )}
    </div>
  )
}
