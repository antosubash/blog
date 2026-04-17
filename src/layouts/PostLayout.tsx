import Comments from "@/components/Comments"
import Image from "@/components/Image"
import Link from "@/components/Link"
import PageTitle from "@/components/PageTitle"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"
import SectionContainer from "@/components/SectionContainer"
import Tag from "@/components/Tag"
import siteMetadata from "@/config/siteMetadata"
import type { Author, Post } from "content-collections"
import type { ReactNode } from "react"

const editUrl = (path: string) => `${siteMetadata.siteRepo}/blob/main/${path}`
const discussUrl = (path: string) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}

interface LayoutProps {
  content: Post
  authorDetails?: Author[]
  next?: { postUrl: string; title: string }
  prev?: { postUrl: string; title: string }
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) {
  const safeAuthorDetails = authorDetails ?? []
  const { filePath, postUrl, slug, date, title, tags } = content
  const basePath = postUrl.split("/")[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-border">
          <header className="pt-12 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-muted-foreground">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-border pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-border xl:pt-11">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {safeAuthorDetails.map((author) => (
                    <li
                      className="flex items-center space-x-2"
                      key={author.name}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-foreground">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-accent transition-colors duration-150 hover:text-accent-hover"
                            >
                              {author.twitter.replace(
                                "https://twitter.com/",
                                "@"
                              )}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-border xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                {children}
              </div>
              <div className="pb-6 pt-6 text-sm text-muted-foreground">
                <Link href={discussUrl(postUrl)} rel="nofollow">
                  Discuss on Twitter
                </Link>
                {" • "}
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
            </div>
            <footer>
              <div className="divide-border text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags
                        ?.filter((tag: string) => tag)
                        .map((tag: string) => (
                          <Tag key={tag} text={tag} />
                        ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev?.postUrl && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                          Previous Article
                        </h2>
                        <div className="text-accent transition-colors duration-150 hover:text-accent-hover">
                          <Link href={`${prev.postUrl}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next?.postUrl && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                          Next Article
                        </h2>
                        <div className="text-accent transition-colors duration-150 hover:text-accent-hover">
                          <Link href={`${next.postUrl}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-accent transition-colors duration-150 hover:text-accent-hover"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
