import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import Link from "./Link"

interface PostEnhancementsProps {
  tags?: string[]
}

export default function PostEnhancements({
  tags,
}: PostEnhancementsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll to top button visibility
  useEffect(() => {
    const updateScrollButton = () => {
      const scrollTop = window.scrollY
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', updateScrollButton)

    return () => {
      window.removeEventListener('scroll', updateScrollButton)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Enhanced Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-accent-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent-muted/70"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
