import Tag from "@/components/Tag"
import { Link } from "@tanstack/react-router"
import { format, parseISO } from "date-fns"
import { ArrowRight, BookOpen, Calendar, TrendingUp } from "lucide-react"

interface RelatedPostItem {
  slug: string
  date: string
  title: string
  excerpt?: string
  tags: string[]
  series?: string | null
  part?: number | null
  readingTime?:
    | string
    | {
        text: string
      }
}

const RelatedPost = ({ posts }: { posts: RelatedPostItem[] }) => {
  if (posts.length === 0) return null

  return (
    <div className="not-prose mt-12 border-t border-border pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">Related Posts</h3>
        <p className="text-sm text-muted-foreground">
          Continue reading with these related articles
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const href = `/posts/${post.slug}`
          return (
            <Link
              key={post.slug}
              to={href}
              className="group block rounded-lg border border-border p-4 no-underline transition-colors duration-150 hover:border-accent/50"
            >
              <div className="space-y-3">
                {/* Header with metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.date}>
                        {format(parseISO(post.date), "MMM d, yyyy")}
                      </time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-3 w-3" />
                        <span>
                          {typeof post.readingTime === "string"
                            ? post.readingTime
                            : post.readingTime.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Series badge */}
                {post.series && (
                  <div className="inline-flex items-center rounded-full bg-accent-muted/50 px-2 py-1 text-xs font-medium text-foreground">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {post.series}
                    {post.part && (
                      <span className="ml-1 rounded-full bg-accent-muted/70 px-1.5 py-0.5 text-xs font-bold">
                        Part {post.part}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div>
                  <h4 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-accent">
                    {post.title}
                  </h4>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <Tag key={tag} text={tag} asLink={false} />
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Read more link */}
                <div className="pt-2">
                  <div className="inline-flex items-center text-sm font-medium text-accent no-underline transition-all duration-200 group-hover:text-accent-hover">
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
