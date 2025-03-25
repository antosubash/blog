'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import { MDXComponents } from 'mdx/types'
import CustomTOCInline from './CustomTOCInline'
import { useState, useEffect } from 'react'

interface CustomMDXLayoutRendererProps {
  code: string
  components?: MDXComponents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toc?: any
  slug?: string
  videoId?: string
  series?: string
}

export default function CustomMDXLayoutRenderer({
  code,
  components = {},
  toc,
  slug,
  videoId,
  series,
}: CustomMDXLayoutRendererProps) {
  const MDXContent = useMDXComponent(code)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Error boundary for MDX rendering
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
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    )
  }

  return (
    <div className="mdx-content">
      {/* Series information */}
      {series && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
            Series: {series}
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            This post is part of the {series} series.
          </p>
        </div>
      )}

      {/* Video embed if videoId is provided */}
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

      {/* Table of Contents */}
      {toc && (
        <div className="mb-8">
          <CustomTOCInline toc={toc} />
        </div>
      )}

      {/* Main MDX content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <MDXContent components={components} />
      </div>
    </div>
  )
}
