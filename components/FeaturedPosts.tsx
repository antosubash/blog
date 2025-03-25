import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { Calendar, BookOpen, ArrowRight } from 'lucide-react'
import Tag from './Tag'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Posts } from 'contentlayer/generated'

interface FeaturedPostsProps {
  posts: CoreContent<Posts>[]
  maxPosts?: number
}

export default function FeaturedPosts({ posts, maxPosts = 3 }: FeaturedPostsProps) {
  const featuredPosts = posts.slice(0, maxPosts)

  if (featuredPosts.length === 0) return null

  return (
    <section className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Featured Articles
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start with these popular articles to get the most value
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPosts
          .map((post, index) => {
            // Safety check to ensure all required properties exist
            if (!post.slug || !post.title || !post.date) {
              console.warn('Featured post missing required properties:', post)
              return null
            }

            return (
              <article
                key={post.path}
                className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 ${
                  index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Featured badge for first post */}
                {index === 0 && (
                  <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90" />
                )}

                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.date}>{format(parseISO(post.date), 'MMM d, yyyy')}</time>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {typeof post.readingTime === 'string'
                          ? post.readingTime
                          : post.readingTime &&
                              typeof post.readingTime === 'object' &&
                              'text' in post.readingTime
                            ? post.readingTime.text
                            : '5 min read'}
                      </span>
                    </div>
                  </div>

                  {/* Series badge */}
                  {post.series && (
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                      {post.series}
                      {post.part && (
                        <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-xs dark:bg-blue-800">
                          Part {post.part}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold leading-7 tracking-tight text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 sm:text-2xl sm:leading-8">
                    <Link href={`/posts/${post.slug}`} className="block">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="line-clamp-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More Link */}
                  <div className="pt-2">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary-600 transition-all duration-200 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Read full article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-blue-900/10" />
              </article>
            )
          })
          .filter(Boolean)}
      </div>

      {/* View all posts link */}
      <div className="mt-8 text-center">
        <Link
          href="/posts"
          className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          View all articles
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
