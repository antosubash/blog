import { ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PaginationProps {
  totalPages: number
  currentPage: number
  maxVisiblePages?: number
}

export default function EnhancedPagination({
  totalPages,
  currentPage,
  maxVisiblePages = 5,
}: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]

  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)

    // Adjust if we're near the edges
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1)
      } else {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return `/${basePath}/`
    }
    return `/${basePath}/page/${page}`
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-12">
      {/* Page Info */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Page <span className="font-semibold text-gray-900 dark:text-gray-100">{currentPage}</span>{' '}
          of <span className="font-semibold text-gray-900 dark:text-gray-100">{totalPages}</span>
        </p>
      </div>

      {/* Pagination Navigation */}
      <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
        {/* Previous button */}
        <Link
          href={prevPage ? getPageUrl(currentPage - 1) : '#'}
          className={`inline-flex items-center space-x-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
            prevPage
              ? 'border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm hover:border-gray-400 hover:bg-gray-50 hover:text-blue-600 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-blue-400'
              : 'cursor-not-allowed border-gray-200 bg-gray-100/80 text-gray-400 dark:border-gray-600 dark:bg-gray-700/80 dark:text-gray-500'
          }`}
          aria-disabled={!prevPage}
          tabIndex={prevPage ? 0 : -1}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>

        {/* Page numbers */}
        <div className="flex items-center space-x-2">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}-${page}`}
                  className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )
            }

            const pageNum = page as number
            const isCurrentPage = pageNum === currentPage

            return (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum)}
                className={`inline-flex items-center rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isCurrentPage
                    ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg dark:border-blue-500 dark:from-blue-500 dark:to-indigo-500'
                    : 'border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm hover:border-gray-400 hover:bg-gray-50 hover:text-blue-600 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                }`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            )
          })}
        </div>

        {/* Next button */}
        <Link
          href={nextPage ? getPageUrl(currentPage + 1) : '#'}
          className={`inline-flex items-center space-x-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
            nextPage
              ? 'border-gray-300 bg-white/80 text-gray-700 backdrop-blur-sm hover:border-gray-400 hover:bg-gray-50 hover:text-blue-600 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-blue-400'
              : 'cursor-not-allowed border-gray-200 bg-gray-100/80 text-gray-400 dark:border-gray-600 dark:bg-gray-700/80 dark:text-gray-500'
          }`}
          aria-disabled={!nextPage}
          tabIndex={nextPage ? 0 : -1}
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* Quick Navigation */}
      <div className="flex items-center space-x-4">
        <Link
          href={getPageUrl(1)}
          className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
          }`}
        >
          First
        </Link>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <Link
          href={getPageUrl(totalPages)}
          className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
          }`}
        >
          Last
        </Link>
      </div>
    </div>
  )
}
