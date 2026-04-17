import Tag from "@/components/Tag"
import { genPageMetadata } from "@/lib/seo"
import { getAllSeries } from "@/lib/series-utils"
import { Link, createFileRoute } from "@tanstack/react-router"
import { format, parseISO } from "date-fns"
import { useMemo } from "react"

export const Route = createFileRoute("/series/")({
  component: SeriesPage,
  head: () =>
    genPageMetadata({
      title: "Series",
      description:
        "Explore comprehensive guides and tutorials organized in series.",
    }),
})

function SeriesPage() {
  const seriesGroups = useMemo(() => getAllSeries(), [])

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Blog Series
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Comprehensive guides and tutorials organized in series.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {seriesGroups.length} series available
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {seriesGroups.map((series) => (
          <Link
            key={series.name}
            to="/posts/$"
            params={{ _splat: series.posts[0].slug }}
            className="group block rounded-lg border border-border bg-surface p-6 transition-colors duration-150 hover:border-accent/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {series.totalParts} parts
              </span>
              <time
                dateTime={series.latestDate}
                className="text-sm text-muted-foreground"
              >
                {format(parseISO(series.latestDate), "MMM d, yyyy")}
              </time>
            </div>

            <h2 className="mt-3 font-display text-xl font-semibold text-foreground transition-colors duration-150 group-hover:text-accent">
              {series.name}
            </h2>

            {/* Parts preview */}
            <div className="mt-4 space-y-1.5">
              {series.posts.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  className="flex items-baseline gap-2 text-sm"
                >
                  <span className="font-medium text-accent">{post.part}.</span>
                  <span className="line-clamp-1 text-muted-foreground">
                    {post.title}
                  </span>
                </div>
              ))}
              {series.posts.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{series.posts.length - 3} more parts
                </p>
              )}
            </div>

            {series.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {series.tags.slice(0, 4).map((tag) => (
                  <Tag key={tag} text={tag} asLink={false} />
                ))}
                {series.tags.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{series.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
