import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Posts } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Tag from '@/components/Tag'

type PostNavigationItem = {
  postUrl: string
  title: string
}

interface LayoutProps {
  content: CoreContent<Posts>
  children: ReactNode
  next?: PostNavigationItem
  prev?: PostNavigationItem
}

const editUrl = (path: string): string => `${siteMetadata.siteRepo}/blob/main/data/${path}`

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { filePath, slug, date, title, tags, readingTime } = content
  const formattedDate = formatDate(date, siteMetadata.locale)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-7xl">
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6">
            <div className="space-y-4 border-b border-gray-200 pb-6 text-center dark:border-gray-700">
              <dl className="space-y-2">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date} aria-label={`Published on ${formattedDate}`}>
                      {formattedDate}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <nav aria-label="Post tags" className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </nav>
              <div
                className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
                aria-label={`Estimated reading time: ${readingTime.text}`}
              >
                {readingTime.text}
              </div>
            </div>
          </header>

          <div className="divide-y divide-gray-200 pb-8 dark:divide-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
            <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
              <Link
                href={editUrl(filePath)}
                className="hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="View this post on GitHub"
              >
                View on GitHub
              </Link>
            </div>

            {siteMetadata.comments && (
              <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}

            <footer className="pt-6">
              <nav
                className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:text-base"
                aria-label="Post navigation"
              >
                {prev && (
                  <div>
                    <Link
                      href={prev.postUrl}
                      className="group flex items-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      <span aria-hidden="true" className="mr-2">
                        &larr;
                      </span>
                      <span className="line-clamp-1">{prev.title}</span>
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="text-right">
                    <Link
                      href={next.postUrl}
                      className="group flex items-center justify-end text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      <span className="line-clamp-1">{next.title}</span>
                      <span aria-hidden="true" className="ml-2">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                )}
              </nav>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
