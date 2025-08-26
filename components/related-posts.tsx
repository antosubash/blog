import type { Posts } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import { ArrowRight, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Tag from './Tag'

const RelatedPost = ({ posts }: { posts: Posts[] }) => {
  if (posts.length === 0) return null

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white/80 p-6 no-underline shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Related Posts</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Continue reading with these related articles
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const href = `/posts/${post.slug}`
          return (
            <Link
              key={post.slug}
              href={href}
              className="group block rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <div className="space-y-3">
                {/* Header with metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.date}>{format(parseISO(post.date), 'MMM d, yyyy')}</time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-3 w-3" />
                        <span>
                          {typeof post.readingTime === 'string'
                            ? post.readingTime
                            : post.readingTime.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Series badge */}
                {post.series && (
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 text-xs font-medium text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {post.series}
                    {post.part && (
                      <span className="ml-1 rounded-full bg-blue-200 px-1.5 py-0.5 text-xs font-bold dark:bg-blue-800">
                        Part {post.part}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div>
                  <h4 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {post.title}
                  </h4>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag} text={tag} asLink={false} />
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Read more link */}
                <div className="pt-2">
                  <div className="inline-flex items-center text-sm font-medium text-blue-600 no-underline transition-all duration-200 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                    Read article
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedPost
