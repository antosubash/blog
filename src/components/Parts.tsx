import { getSeriesByName, getSeriesProgress } from "@/lib/series-utils"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Circle,
  TrendingUp,
} from "lucide-react"

interface PartsProps {
  data: string
}

const Parts = (props: PartsProps) => {
  const post = getSeriesByName(props.data)?.posts.find(
    (p) => p.slug === props.data
  )

  if (!post) return null

  const series = getSeriesByName(post.series)
  const progress = getSeriesProgress(post.series, post.part)

  if (!series || !progress) return null

  return (
    <div className="my-8 rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-sm">
      {/* Series Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center space-x-2">
          <div className="inline-flex items-center rounded-full bg-accent-muted/50 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm">
            <TrendingUp className="mr-1.5 h-3 w-3" />
            Series
          </div>
          <span className="text-lg font-semibold text-foreground">
            {post.series}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {progress.currentPart} of {progress.totalParts} parts
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface">
            <div
              className="h-2 rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Series Navigation */}
      <div className="space-y-3">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Parts in this series:
        </h3>

        <div className="space-y-2">
          {series.posts.map((blogPost) => {
            const isCurrentPost = props.data === blogPost.slug
            const isCompleted = blogPost.part < progress.currentPart
            const isNext = blogPost.part === progress.currentPart + 1

            return (
              <Link
                key={blogPost.slug}
                to="/posts/$"
                params={{ _splat: blogPost.slug }}
                className={`group flex items-center space-x-3 rounded-lg border p-3 transition-all duration-200 ${
                  isCurrentPost
                    ? "border-accent bg-accent-muted/30"
                    : isCompleted
                      ? "border-green-200 bg-green-50 hover:border-green-300 dark:border-green-700 dark:bg-green-900/20 dark:hover:border-green-600"
                      : isNext
                        ? "border-orange-200 bg-orange-50 hover:border-orange-300 dark:border-orange-700 dark:bg-orange-900/20 dark:hover:border-orange-600"
                        : "border-border bg-surface hover:border-border"
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isCurrentPost ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        isCurrentPost
                          ? "bg-accent-muted/50 text-foreground"
                          : isCompleted
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : isNext
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : "bg-surface text-muted-foreground"
                      }`}
                    >
                      Part {blogPost.part}
                    </span>
                    {isCurrentPost && (
                      <span className="text-xs font-medium text-accent">
                        Current
                      </span>
                    )}
                    {isNext && (
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        Next
                      </span>
                    )}
                  </div>
                  <h4
                    className={`line-clamp-2 text-sm font-medium ${
                      isCurrentPost ? "text-foreground" : "text-foreground"
                    }`}
                  >
                    {blogPost.title}
                  </h4>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        {progress.prevPart ? (
          <Link
            to="/posts/$"
            params={{ _splat: progress.prevPart.slug }}
            className="inline-flex items-center space-x-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {progress.nextPart ? (
          <Link
            to="/posts/$"
            params={{ _splat: progress.nextPart.slug }}
            className="inline-flex items-center space-x-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-accent-hover hover:shadow-xl"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default Parts
