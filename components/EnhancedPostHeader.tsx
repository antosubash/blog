'use client'

import { format, parseISO } from 'date-fns'
import { Calendar, Clock, Eye, Share2, BookOpen, User } from 'lucide-react'
import Link from '@/components/Link'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Posts, Authors } from 'contentlayer/generated'

interface EnhancedPostHeaderProps {
  post: CoreContent<Posts>
  authorDetails: CoreContent<Authors>[]
}

export default function EnhancedPostHeader({ post, authorDetails }: EnhancedPostHeaderProps) {
  const { title, date, tags, readingTime, series, part } = post

  const getReadingTimeText = () => {
    if (!readingTime) return null
    if (typeof readingTime === 'string') return readingTime
    return `${readingTime.minutes} min read`
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
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <header className="mb-8">
      {/* Series Badge */}
      {series && (
        <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-sm font-medium text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
          <BookOpen className="mr-2 h-4 w-4" />
          {series}
          {part && (
            <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold dark:bg-blue-800">
              Part {part}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-5xl">
        {title}
      </h1>

      {/* Meta Information */}
      <div className="mb-6 space-y-4">
        {/* Authors */}
        <div className="flex items-center space-x-4">
          <User className="h-4 w-4 text-gray-500" />
          <div className="flex items-center space-x-2">
            {authorDetails.map((author, index) => (
              <div key={author.name} className="flex items-center space-x-2">
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    width={24}
                    height={24}
                    alt={author.name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {author.name}
                </span>
                {index < authorDetails.length - 1 && <span className="text-gray-400">•</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Date and Reading Time */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{format(parseISO(date), 'MMMM d, yyyy')}</time>
          </div>

          {getReadingTimeText() && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getReadingTimeText()}</span>
            </div>
          )}

          {readingTime && typeof readingTime === 'object' && (
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{readingTime.words.toLocaleString()} words</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        )}

        {/* Share Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={sharePost}
            className="inline-flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-700" />
    </header>
  )
}
