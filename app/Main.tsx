import { ArrowRight, BookOpen, Code2, Rocket } from 'lucide-react'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Link from '@/components/Link'
import PostItem from '@/components/post-item'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const recentPosts = posts.slice(0, MAX_DISPLAY)

  // Calculate stats
  const _totalPosts = posts.length
  const _totalTags = [...new Set(posts.flatMap((post) => post.tags || []))].length
  const currentYear = new Date().getFullYear()
  const _postsThisYear = posts.filter(
    (post) => new Date(post.date).getFullYear() === currentYear
  ).length

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200 sm:px-4 sm:py-2 sm:text-sm">
                <Rocket className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Welcome to my tech blog
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:mb-6 sm:text-4xl lg:text-6xl">
              Learn about{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Web Development
              </span>
              <br />
              and Programming
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-lg sm:leading-8 lg:text-xl">
              {siteMetadata.description} Explore tutorials, guides, and insights on modern web
              technologies, microservices, and software development best practices.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-primary-700 sm:px-6 sm:py-3 sm:text-base"
              >
                Explore Posts
                <ArrowRight className="ml-1.5 h-4 w-4 sm:ml-2" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-6 sm:py-3 sm:text-base"
              >
                View Projects
                <Code2 className="ml-1.5 h-4 w-4 sm:ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div className="bg-gray-50 py-12 dark:bg-gray-900 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">
                Latest Posts
              </h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-lg">
                Explore the most recent articles and tutorials
              </p>
            </div>
            <div className="space-y-6 sm:space-y-8">
              {recentPosts.map((post) => {
                const { slug, date, title, excerpt, tags, series, part } = post
                return (
                  <div key={slug}>
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      summary={excerpt}
                      tags={tags}
                      series={series}
                      part={part}
                    />
                  </div>
                )
              })}
            </div>
            {posts.length > MAX_DISPLAY && (
              <div className="mt-8 text-center sm:mt-12">
                <Link
                  href="/posts"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-primary-700 sm:px-6 sm:py-3 sm:text-base"
                  aria-label="All posts"
                >
                  View All Posts
                  <ArrowRight className="ml-1.5 h-4 w-4 sm:ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      {siteMetadata.newsletter?.provider && (
        <div className="bg-white py-12 dark:bg-gray-800 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <BookOpen className="mx-auto h-8 w-8 text-primary-600 sm:h-12 sm:w-12" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:mt-4 sm:text-3xl">
                Stay Updated
              </h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-4 sm:text-lg">
                Get the latest posts and updates delivered to your inbox
              </p>
              <div className="mt-6 sm:mt-8">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
