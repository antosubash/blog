import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import PostItem from '@/components/post-item'
import { ArrowRight, BookOpen, Code2, Rocket, FileText, Users, Calendar } from 'lucide-react'

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const recentPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <>
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
