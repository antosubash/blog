'use client'

import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from '@/components/Link'

interface PostEnhancementsProps {
  slug: string
  title: string
  readingTime?: string | { text: string; minutes: number; time: number; words: number }
  tags?: string[]
}

export default function PostEnhancements({
  slug,
  title,
  readingTime,
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

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
            title="Scroll to top"
          >
            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Enhanced Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
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
