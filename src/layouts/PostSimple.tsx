import Comments from "@/components/Comments"
import Link from "@/components/Link"
import PageTitle from "@/components/PageTitle"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/config/siteMetadata"
import { formatDate } from "@/lib/content-utils"
import { getReadingTimeDisplay } from "@/lib/reading-time"
import type { Post } from "content-collections"
import type { ReactNode } from "react"

interface LayoutProps {
  content: Post
  children: ReactNode
  next?: { postUrl: string; title: string }
  prev?: { postUrl: string; title: string }
}

const editUrl = (path: string) => `${siteMetadata.siteRepo}/blob/main/${path}`

export default function PostLayout({
  content,
  next,
  prev,
  children,
}: LayoutProps) {
  const { filePath, slug, date, title, readingTime } = content

  const readingTimeDisplay = getReadingTimeDisplay(readingTime)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header className="pt-10">
            <div className="space-y-1 border-b border-border pb-6 text-center">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-muted-foreground">
                    <time dateTime={date}>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div className="pb-1">
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="flex items-center justify-center gap-2 pt-3 text-base font-medium leading-6">
                <span className={`${readingTimeDisplay.color}`}>
                  {readingTimeDisplay.icon}
                </span>
                <span className="text-muted-foreground">
                  {readingTimeDisplay.text}
                </span>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-border pb-8">
            <div className="divide-y divide-border xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                {children}
              </div>
            </div>
            <div className="pb-6 pt-6 text-sm text-muted-foreground">
              <Link href={editUrl(filePath)}>View on GitHub</Link>
            </div>
            {siteMetadata.comments && (
              <div
                className="pb-6 pt-6 text-center text-muted-foreground"
                id="comment"
              >
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev?.postUrl && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`${prev.postUrl}`}
                      className="text-accent transition-colors duration-150 hover:text-accent-hover"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next?.postUrl && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`${next.postUrl}`}
                      className="text-accent transition-colors duration-150 hover:text-accent-hover"
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
