import { createFileRoute, Link } from "@tanstack/react-router"
import { genPageMetadata } from "@/lib/seo"
import { allPosts } from "content-collections"
import PostItem from "@/components/post-item"
import { ArrowRight } from "lucide-react"

const MAX_DISPLAY = 8

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    genPageMetadata({
      title: "Home",
      description:
        "Software engineer sharing what I learn — from cloud infrastructure to frontend frameworks and everything in between.",
    }),
})

function HomePage() {
  const sortedPosts = [...allPosts]
    .filter((post) => !post.draft && !post.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentPosts = sortedPosts.slice(0, MAX_DISPLAY)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Personal intro */}
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Latest Posts
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Software engineer sharing what I learn — from cloud infrastructure to
          frontend frameworks and everything in between.
        </p>
      </div>

      {/* Post list */}
      {recentPosts.length > 0 && (
        <div className="divide-y divide-border">
          {recentPosts.map((post) => (
            <PostItem
              key={post.slug}
              slug={post.slug}
              date={new Date(post.date).toISOString()}
              title={post.title}
              summary={post.excerpt || ""}
              tags={post.tags}
              series={post.series ?? undefined}
              part={post.part ?? undefined}
            />
          ))}
        </div>
      )}

      {sortedPosts.length > MAX_DISPLAY && (
        <div className="py-8">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
