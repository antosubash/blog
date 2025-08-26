import type { Posts } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import type { ReactNode } from 'react'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { getReadingTimeDisplay } from '@/lib/reading-time'

interface LayoutProps {
  content: CoreContent<Posts>
  children: ReactNode
  next?: { postUrl: string; title: string }
  prev?: { postUrl: string; title: string }
}

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { filePath, slug, date, title, tags, readingTime } = content

  // Get enhanced reading time display
  const readingTimeDisplay = getReadingTimeDisplay(readingTime)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header className="pt-10">
            <div className="space-y-1 border-b border-gray-200 pb-6 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </div>
              </dl>
              <div className="pb-1">
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="flex items-center justify-center gap-2 pt-3 text-base font-medium leading-6">
                <span className={`${readingTimeDisplay.color}`}>{readingTimeDisplay.icon}</span>
                <span className="text-gray-500 dark:text-gray-400">{readingTimeDisplay.text}</span>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
            <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
              <Link href={editUrl(filePath)}>View on GitHub</Link>
            </div>
            {siteMetadata.comments && (
              <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.postUrl && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`${prev.postUrl}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.postUrl && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`${next.postUrl}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
