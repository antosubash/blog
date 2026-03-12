import { createFileRoute } from "@tanstack/react-router"
import { slug as slugify } from "github-slugger"
import { allPosts } from "content-collections"
import EnhancedListLayout from "@/layouts/EnhancedListLayout"

export const Route = createFileRoute("/tags/$tag")({
  component: TagPage,
})

function TagPage() {
  const { tag } = Route.useParams()
  const decodedTag = decodeURI(tag)
  const title =
    decodedTag[0].toUpperCase() + decodedTag.split(" ").join("-").slice(1)

  const filteredPosts = [...allPosts]
    .filter(
      (post) =>
        !post.draft &&
        !post.isDraft &&
        post.tags &&
        post.tags
          .filter((t: string) => t)
          .map((t: string) => slugify(t))
          .includes(decodedTag)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      ...post,
      date: new Date(post.date).toISOString(),
    }))

  return <EnhancedListLayout posts={filteredPosts} title={`${title} Articles`} />
}
