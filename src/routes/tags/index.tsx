import Link from "@/components/Link"
import Tag from "@/components/Tag"
import { genPageMetadata } from "@/lib/seo"
import { getTagsWithCount } from "@/lib/tag-utils"
import { createFileRoute } from "@tanstack/react-router"
import { slug } from "github-slugger"

export const Route = createFileRoute("/tags/")({
  component: TagsPage,
  head: () =>
    genPageMetadata({ title: "Tags", description: "Things I blog about" }),
})

function TagsPage() {
  const tagsWithCount = getTagsWithCount()
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Tags
        </h1>
      </div>
      <div>
        <div className="flex flex-wrap">
          {tagsWithCount.length === 0 && "No tags found."}
          {tagsWithCount.map((t) => {
            return (
              <div key={t.tag} className="mb-2 mr-5 mt-2">
                <Tag text={t.tag} />
                <Link
                  href={`/tags/${slug(t.tag)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-muted-foreground"
                  aria-label={`View posts tagged ${t.tag}`}
                >
                  {` (${t.count})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
