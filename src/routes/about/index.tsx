import { genPageMetadata } from "@/lib/seo"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => genPageMetadata({ title: "About" }),
})

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-6">
      <div className="pb-8 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          About
        </h1>
      </div>
      <div className="prose max-w-none pb-8 dark:prose-invert">
        <p>
          Hi, I'm Anto Subash. I'm a full-stack developer passionate about web
          technologies, microservices, and modern software development.
        </p>
        <p>
          I share insights on .NET, React, Docker, Kubernetes, and cloud-native
          solutions through this blog.
        </p>
      </div>
    </div>
  )
}
