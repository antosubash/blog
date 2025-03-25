'use client'

import Link from 'next/link'
import { getSeriesProgress, getSeriesByName } from '@/lib/series-utils'
import { TrendingUp, ChevronRight, CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react'

interface PartsProps {
  data: string
}

const Parts = (props: PartsProps) => {
  const post = getSeriesByName(props.data)?.posts.find((p) => p.slug === props.data)

  if (!post) return null

  const series = getSeriesByName(post.series)
  const progress = getSeriesProgress(post.series, post.part)

  if (!series || !progress) return null

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
      {/* Series Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center space-x-2">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 text-sm font-medium text-blue-800 shadow-sm dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
            <TrendingUp className="mr-1.5 h-3 w-3" />
            Series
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {post.series}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>
              {progress.currentPart} of {progress.totalParts} parts
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Series Navigation */}
      <div className="space-y-3">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                href={`/posts/${blogPost.slug}`}
                className={`group flex items-center space-x-3 rounded-lg border p-3 transition-all duration-200 ${
                  isCurrentPost
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                    : isCompleted
                      ? 'border-green-200 bg-green-50 hover:border-green-300 dark:border-green-700 dark:bg-green-900/20 dark:hover:border-green-600'
                      : isNext
                        ? 'border-orange-200 bg-orange-50 hover:border-orange-300 dark:border-orange-700 dark:bg-orange-900/20 dark:hover:border-orange-600'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:border-gray-600'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isCurrentPost ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                        isCurrentPost
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : isCompleted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : isNext
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Part {blogPost.part}
                    </span>
                    {isCurrentPost && (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
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
                      isCurrentPost
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {blogPost.title}
                  </h4>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        {progress.prevPart ? (
          <Link
            href={`/posts/${progress.prevPart.slug}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {progress.nextPart ? (
          <Link
            href={`/posts/${progress.nextPart.slug}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
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
