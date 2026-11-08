import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react"
import type { ReactNode } from "react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  /** First path segment, e.g. "posts" -> /posts/ and /posts/page/2 */
  basePath: string
  maxVisiblePages?: number
  /** Client-side pagination (buttons) instead of page links. */
  onPageChange?: (page: number) => void
}

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 5
) {
  const pages: (number | "...")[] = []
  const halfVisible = Math.floor(maxVisiblePages / 2)

  let start = Math.max(1, currentPage - halfVisible)
  let end = Math.min(totalPages, currentPage + halfVisible)

  if (end - start + 1 < maxVisiblePages) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisiblePages - 1)
    } else {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push("...")
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...")
    pages.push(totalPages)
  }
  return pages
}

export default function EnhancedPagination({
  totalPages,
  currentPage,
  basePath,
  maxVisiblePages = 5,
  onPageChange,
}: PaginationProps) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages)

  const getPageUrl = (page: number) =>
    page === 1 ? `/${basePath}/` : `/${basePath}/page/${page}`

  const navButtonBase =
    "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
  const navButtonEnabled =
    "border-border bg-card text-foreground hover:bg-accent"
  const navButtonDisabled =
    "cursor-not-allowed border-border/50 bg-muted text-muted-foreground"

  const PageButton = ({
    page,
    children,
    className,
    disabled,
    ...props
  }: {
    page: number
    children: ReactNode
    className: string
    disabled?: boolean
    "aria-disabled"?: boolean
    "aria-label"?: string
    "aria-current"?: "page" | undefined
    tabIndex?: number
  }) => {
    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={() => !disabled && onPageChange(page)}
          className={className}
          disabled={disabled}
          aria-disabled={props["aria-disabled"]}
          aria-label={props["aria-label"]}
          aria-current={props["aria-current"]}
          tabIndex={props.tabIndex}
        >
          {children}
        </button>
      )
    }
    return (
      <a
        href={disabled ? "#" : getPageUrl(page)}
        className={className}
        aria-disabled={props["aria-disabled"]}
        aria-label={props["aria-label"]}
        aria-current={props["aria-current"]}
        tabIndex={props.tabIndex}
      >
        {children}
      </a>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <nav className="flex items-center gap-2" aria-label="Pagination">
        <PageButton
          page={currentPage - 1}
          disabled={!prevPage}
          className={`${navButtonBase} ${prevPage ? navButtonEnabled : navButtonDisabled}`}
          aria-disabled={!prevPage}
          aria-label="Previous page"
          tabIndex={prevPage ? 0 : -1}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </PageButton>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              const previousPage = visiblePages[index - 1] ?? "start"
              const nextPageNumber = visiblePages[index + 1] ?? "end"
              return (
                <span
                  key={`ellipsis-${previousPage}-${nextPageNumber}`}
                  className="inline-flex items-center px-3 py-2.5 text-sm text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )
            }
            const isCurrentPage = page === currentPage
            return (
              <PageButton
                key={page}
                page={page}
                className={`${navButtonBase} min-w-[42px] justify-center ${
                  isCurrentPage
                    ? "border-accent bg-accent text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/50"
                }`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {page}
              </PageButton>
            )
          })}
        </div>

        <PageButton
          page={currentPage + 1}
          disabled={!nextPage}
          className={`${navButtonBase} ${nextPage ? navButtonEnabled : navButtonDisabled}`}
          aria-disabled={!nextPage}
          aria-label="Next page"
          tabIndex={nextPage ? 0 : -1}
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4" />
        </PageButton>
      </nav>

      <div className="flex items-center gap-4 text-xs">
        <PageButton
          page={1}
          className={`font-medium transition-colors duration-150 ${
            currentPage === 1
              ? "text-muted-foreground/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          First
        </PageButton>
        <span className="text-border">|</span>
        <PageButton
          page={totalPages}
          className={`font-medium transition-colors duration-150 ${
            currentPage === totalPages
              ? "text-muted-foreground/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Last
        </PageButton>
      </div>
    </div>
  )
}
