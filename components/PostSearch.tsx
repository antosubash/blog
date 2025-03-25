'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Tag as TagIcon, Sparkles } from 'lucide-react'
import Tag from './Tag'

interface PostSearchProps {
  onSearch: (query: string) => void
  onTagFilter: (tags: string[]) => void
  availableTags: string[]
  selectedTags: string[]
}

export default function PostSearch({
  onSearch,
  onTagFilter,
  availableTags,
  selectedTags,
}: PostSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false)
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  const handleTagToggle = (tag: string) => {
    const newTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag]

    setLocalSelectedTags(newTags)
    onTagFilter(newTags)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setLocalSelectedTags([])
    onSearch('')
    onTagFilter([])
  }

  const hasActiveFilters = searchQuery || localSelectedTags.length > 0

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white/80 px-12 py-3.5 text-base placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
          className={`inline-flex items-center space-x-2 rounded-xl border px-6 py-3.5 text-base font-medium transition-all duration-200 ${
            localSelectedTags.length > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
              : 'border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="h-5 w-5" />
          <span>Filter</span>
          {localSelectedTags.length > 0 && (
            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-blue-500">
              {localSelectedTags.length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center space-x-2 rounded-xl border border-gray-300 bg-white/80 px-6 py-3.5 text-base font-medium text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Tag Filter Panel */}
      {isTagFilterOpen && (
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
          <div className="mb-4 flex items-center space-x-2">
            <TagIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filter by Topics
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  localSelectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
                {localSelectedTags.includes(tag) && <X className="ml-2 h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>Active filters:</span>
          </span>

          {searchQuery && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
              <Search className="mr-2 h-3 w-3" />"{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 rounded-full p-0.5 text-blue-600 transition-colors hover:bg-blue-200 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-800 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {localSelectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:from-gray-700 dark:to-gray-600 dark:text-gray-300"
            >
              <TagIcon className="mr-2 h-3 w-3" />
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-2 rounded-full p-0.5 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
