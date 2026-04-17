import { MDXContent } from "@content-collections/mdx/react"
import { useState } from "react"
import CustomTOCInline from "./CustomTOCInline"
import type { MdxComponents } from "./MDXComponents"

interface TocItem {
  value: string
  url: string
  depth: number
}

interface MDXRendererProps {
  code: string
  components?: Partial<MdxComponents>
  toc?: TocItem[]
  slug?: string
  videoId?: string
  series?: string
}

export default function MDXRenderer({
  code,
  components = {},
  toc,
  videoId,
  series,
}: MDXRendererProps) {
  const [error] = useState<string | null>(null)

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Error rendering content
        </h3>
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="mdx-content">
      {series && (
        <div className="mb-6 rounded-lg border border-accent/30 bg-accent-muted/30 p-4">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Series: {series}
          </h3>
          <p className="text-muted-foreground">
            This post is part of the {series} series.
          </p>
        </div>
      )}

      {videoId && (
        <div className="mb-8">
          <div className="relative h-0 w-full pb-[56.25%]">
            <iframe
              className="absolute left-0 top-0 h-full w-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {toc && toc.length > 0 && (
        <div className="mb-8">
          <CustomTOCInline toc={toc} />
        </div>
      )}

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <MDXContent code={code} components={components} />
      </div>
    </div>
  )
}
