'use client'

import type { Posts } from 'contentlayer/generated'
import { BookOpen, Filter, Grid, List, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { useMemo, useState } from 'react'
import EnhancedPagination from '@/components/EnhancedPagination'
import PostSearch from '@/components/PostSearch'
import PostItem from '@/components/post-item'
import Tag from '@/components/Tag'
import { getTagsWithCount } from '@/lib/tag-utils'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface EnhancedListLayoutProps {
  posts: CoreContent<Posts>[]
  title: string
  initialDisplayPosts?: CoreContent<Posts>[]
  pagination?: PaginationProps
}

export default function EnhancedListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: EnhancedListLayoutProps) {
  const pathname = usePathname()
  const tagsWithCount = getTagsWithCount()

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get all available tags for filtering
  const availableTags = useMemo(() => {
    const allTags = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        if (tag) {
          allTags.add(tag)
        }
      })
    })
    return Array.from(allTags).sort()
  }, [posts])

  // Use existing reading time from Contentlayer or calculate fallback
  const postsWithReadingTime = useMemo(() => {
    return posts.map((post) => {
      return {
        ...post,
      }
    })
  }, [posts])

  // Filter posts based on search query and selected tags
  const filteredPosts = useMemo(() => {
    let filtered = postsWithReadingTime

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag && tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) => post.tags?.filter((t) => t).includes(tag))
      )
    }

    return filtered
  }, [postsWithReadingTime, searchQuery, selectedTags])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle tag filtering
  const handleTagFilter = (tags: string[]) => {
    setSelectedTags(tags)
  }

  // Pagination logic
  const POSTS_PER_PAGE = viewMode === 'grid' ? 12 : 8
  const currentPage = pagination?.currentPage || 1
  const totalFilteredPosts = filteredPosts.length
  const totalPages = Math.ceil(totalFilteredPosts / POSTS_PER_PAGE)

  // Get posts for current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPagePosts = filteredPosts.slice(startIndex, endIndex)

  // Use initialDisplayPosts if we're on the first page with no filters, otherwise use paginated results
  const displayPosts =
    initialDisplayPosts.length > 0 && currentPage === 1 && !searchQuery && selectedTags.length === 0
      ? initialDisplayPosts
      : currentPagePosts

  const hasActiveFilters = searchQuery || selectedTags.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-medium text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                <Sparkles className="h-4 w-4" />
                <span>Latest Articles</span>
              </div>
            </div>
            <h1
              className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-gray-100 dark:via-blue-200 dark:to-indigo-200 sm:text-5xl lg:text-6xl"
              style={{ lineHeight: '1.2', paddingBottom: '0.2em' }}
            >
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Discover insights on web development, microservices, and modern software practices.
              From beginner guides to advanced tutorials, find everything you need to level up your
              skills.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <PostSearch
              onSearch={handleSearch}
              onTagFilter={handleTagFilter}
              availableTags={availableTags}
              selectedTags={selectedTags}
            />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          {/* Results Summary */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hasActiveFilters ? (
                <span>
                  Showing {totalFilteredPosts} of {posts.length} posts
                </span>
              ) : (
                <span>{posts.length} articles available</span>
              )}
            </div>
            {selectedTags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Filtered by:</span>
                {selectedTags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Posts List */}
          <div
            className={
              viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-6'
            }
          >
            {displayPosts.length > 0 ? (
              displayPosts
                .map((post) => {
                  if (!post.slug || !post.title || !post.date) {
                    console.warn('Post missing required properties:', post)
                    return null
                  }

                  let safeReadingTime: string | undefined
                  if (typeof post.readingTime === 'string') {
                    safeReadingTime = post.readingTime
                  } else if (
                    post.readingTime &&
                    typeof post.readingTime === 'object' &&
                    'text' in post.readingTime
                  ) {
                    safeReadingTime = post.readingTime.text
                  }

                  return (
                    <PostItem
                      key={post.path}
                      slug={post.slug}
                      date={post.date}
                      title={post.title}
                      summary={post.excerpt || ''}
                      tags={post.tags || []}
                      series={post.series}
                      part={post.part}
                      readingTime={safeReadingTime}
                    />
                  )
                })
                .filter(Boolean)
            ) : (
              <div className="col-span-full rounded-2xl border border-gray-200 bg-white/80 p-12 text-center shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mx-auto max-w-md">
                  <div className="mb-6 text-6xl">🔍</div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    No posts found
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedTags([])
                    }}
                    className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Clear all filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <EnhancedPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
