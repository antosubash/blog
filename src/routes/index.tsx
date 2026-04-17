import PostItem from "@/components/post-item"
import { genPageMetadata } from "@/lib/seo"
import { Link, createFileRoute } from "@tanstack/react-router"
import { allPosts } from "content-collections"
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
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      {/* Personal intro block */}
      <div className="pb-10 pt-14 sm:pb-12 sm:pt-20">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Hey, I'm Anto<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          Full-stack engineer writing about cloud infrastructure, frontend
          frameworks, .NET, and the things I learn along the way.
        </p>
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div>
          <h2 className="mb-6 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Recent Writing
          </h2>
          <div className="space-y-1">
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
        </div>
      )}

      {sortedPosts.length > MAX_DISPLAY && (
        <div className="py-10">
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
