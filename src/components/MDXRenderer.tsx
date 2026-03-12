import { MDXContent } from "@content-collections/mdx/react"
import CustomTOCInline from "./CustomTOCInline"
import { useState, useEffect } from "react"

interface MDXRendererProps {
  code: string
  components?: Record<string, React.ComponentType<any>>
  toc?: any
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
  const [mounted, setMounted] = useState(false)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-3/4 rounded bg-surface"></div>
        <div className="h-4 w-1/2 rounded bg-surface"></div>
        <div className="h-4 w-5/6 rounded bg-surface"></div>
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
