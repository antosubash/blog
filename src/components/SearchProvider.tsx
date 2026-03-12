import { useCallback, useEffect, useState } from "react"
import { Command } from "cmdk"
import { useNavigate } from "@tanstack/react-router"
import { Search, FileText, Tag, X } from "lucide-react"

interface SearchItem {
  slug: string
  title: string
  tags: string[]
  excerpt: string
}

export default function SearchProvider() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<SearchItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (open && items.length === 0) {
      fetch("/search.json")
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch(console.error)
    }
  }, [open, items.length])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false)
      setQuery("")
      navigate({ to: "/posts/$", params: { _splat: slug } })
    },
    [navigate]
  )

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search posts"
      className="fixed inset-0 z-50"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search posts..."
            className="flex h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")} className="ml-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No posts found.
          </Command.Empty>
          {items.map((item) => (
            <Command.Item
              key={item.slug}
              value={`${item.title} ${item.tags.join(" ")}`}
              onSelect={() => handleSelect(item.slug)}
              className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground aria-selected:bg-accent-muted/50 aria-selected:text-foreground"
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">{item.title}</div>
                {item.excerpt && (
                  <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {item.excerpt}
                  </div>
                )}
                {item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-accent-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        <Tag className="mr-1 h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Command.Item>
          ))}
        </Command.List>
        <div className="border-t border-border px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Navigate with arrow keys</span>
            <span>
              <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  )
}
