import Link from 'next/link'
import React from 'react'
import { format, parseISO } from 'date-fns'
import Tag from './Tag'
import { Calendar, Clock, ArrowRight, Eye, BookOpen, TrendingUp } from 'lucide-react'

interface PostItemProps {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  series?: string
  part?: number
  readingTime?: string
  views?: number
}

const PostItem = ({
  slug,
  date,
  title,
  summary,
  series,
  tags,
  part,
  readingTime,
  views,
}: PostItemProps) => {
  return (
    <Link href={`/posts/${slug}`} className="block">
      <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-gray-600 sm:p-8">
        <div className="space-y-5 sm:space-y-6">
          {/* Header with metadata */}
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={date}>{format(parseISO(date), 'MMM d, yyyy')}</time>
                </div>
                {readingTime && (
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{readingTime}</span>
                  </div>
                )}
                {views && (
                  <div className="flex items-center space-x-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{views} views</span>
                  </div>
                )}
              </div>
              {series && (
                <div className="flex items-center space-x-2">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 text-sm font-medium text-blue-800 shadow-sm dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                    <TrendingUp className="mr-1.5 h-3 w-3" />
                    {series}
                    {part && (
                      <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold dark:bg-blue-800">
                        Part {part}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold leading-7 tracking-tight text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 sm:text-2xl sm:leading-8">
              {title}
            </h2>
            <p className="line-clamp-3 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {summary}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <Tag key={tag} text={tag} asLink={false} />
              ))}
              {tags.length > 4 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  +{tags.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="pt-2">
            <div className="inline-flex items-center text-sm font-semibold text-primary-600 transition-all duration-200 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 sm:text-base">
              Read full article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Enhanced gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-blue-900/20" />

        {/* Subtle border animation */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </article>
    </Link>
  )
}

export default PostItem
