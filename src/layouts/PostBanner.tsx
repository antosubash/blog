import Comments from "@/components/Comments"
import Image from "@/components/Image"
import Link from "@/components/Link"
import PageTitle from "@/components/PageTitle"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/config/siteMetadata"
import type { Post } from "content-collections"
import type { ReactNode } from "react"

interface LayoutProps {
  content: Post
  children: ReactNode
  next?: { postUrl: string; title: string }
  prev?: { postUrl: string; title: string }
}

export default function PostMinimal({
  content,
  next,
  prev,
  children,
}: LayoutProps) {
  const { slug, title, images } = content
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://picsum.photos/seed/picsum/800/400"

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center border-border">
            <div className="w-full">
              <div className="w-full">
                <div className="relative aspect-[2/1] w-full">
                  <Image
                    src={displayImage}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose max-w-none py-4 dark:prose-invert">
            {children}
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
                    className="text-accent hover:text-accent-hover"
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
                    className="text-accent hover:text-accent-hover"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
