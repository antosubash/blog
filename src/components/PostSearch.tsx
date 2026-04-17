import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [showTags, setShowTags] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    onTagFilter(newTags)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search posts"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-b border-border bg-transparent py-2 pl-6 pr-8 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:rounded-sm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowTags(!showTags)}
          aria-expanded={showTags}
          className={`rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
            selectedTags.length > 0
              ? "text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tags{selectedTags.length > 0 ? ` (${selectedTags.length})` : ""}
        </button>
      </div>

      {showTags && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
                selectedTags.includes(tag)
                  ? "bg-accent text-primary-foreground"
                  : "bg-accent-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
