'use client'

import { useEffect, useRef, useState } from 'react'

// Global mermaid instance
let mermaidInstance: any = null // eslint-disable-line @typescript-eslint/no-explicit-any

interface MermaidProps {
  chart: string
  className?: string
}

// Global initialization flag
let isMermaidInitialized = false

const loadMermaid = async () => {
  if (!mermaidInstance) {
    const mermaidModule = await import('mermaid')
    mermaidInstance = mermaidModule.default
  }
  return mermaidInstance
}

const initializeMermaid = async () => {
  if (!isMermaidInitialized && typeof window !== 'undefined') {
    const mermaid = await loadMermaid()
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      fontSize: 14,
    })
    isMermaidInitialized = true
  }
}

const Mermaid = ({ chart, className = '' }: MermaidProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [svgContent, setSvgContent] = useState<string>('')

  // Ensure we're in the browser
  useEffect(() => {
    setMounted(true)
  }, [])

  // Effect to handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Effect to render when both mounted and ref is available
  useEffect(() => {
    const renderMermaid = async () => {
      console.log('renderMermaid called with:', {
        mounted,
        chart: chart?.substring(0, 50),
        elementRef: !!elementRef.current,
      })

      if (!mounted || !elementRef.current || !chart?.trim()) {
        console.log('Not ready to render:', {
          mounted,
          hasRef: !!elementRef.current,
          hasChart: !!chart?.trim(),
        })
        return
      }

      try {
        console.log('Starting Mermaid render...')
        setIsLoading(true)
        setError(null)

        // Load and initialize mermaid
        console.log('Loading Mermaid...')
        const mermaid = await loadMermaid()

        // Initialize mermaid globally
        console.log('Initializing Mermaid...')
        await initializeMermaid()

        // Generate unique ID for the diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        console.log('Generated ID:', id)

        // Render the chart
        console.log('Rendering chart...')
        const { svg } = await mermaid.render(id, chart.trim())
        console.log('SVG generated, length:', svg.length)

        // Use React state to update the content instead of innerHTML
        setSvgContent(svg)
        console.log('SVG content set in state')

        setIsLoading(false)
        console.log('Render complete')
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
        setIsLoading(false)
      }
    }

    console.log('Render effect triggered:', {
      mounted,
      chartLength: chart?.length,
      hasRef: !!elementRef.current,
    })

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      renderMermaid()
    }, 50)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, mounted, elementRef.current])

  if (error) {
    return (
      <div
        className={`rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 ${className}`}
      >
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Mermaid Diagram Error
        </h3>
        <p className="text-red-700 dark:text-red-300">{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-red-600 dark:text-red-400">
            Show diagram code
          </summary>
          <pre className="mt-2 rounded bg-red-100 p-2 text-xs dark:bg-red-900/30">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`mermaid-diagram overflow-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
            Mermaid Diagram Error
          </h3>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-600 dark:text-red-400">
              Show diagram code
            </summary>
            <pre className="mt-2 rounded bg-red-100 p-2 text-xs dark:bg-red-900/30">
              <code>{chart}</code>
            </pre>
          </details>
        </div>
      )}

      {(!mounted || isLoading) && !error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {!mounted ? 'Loading...' : 'Rendering diagram...'}
            </p>
          </div>
        </div>
      )}

      {svgContent && !error && !isLoading && (
        <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
      )}
    </div>
  )
}

export default Mermaid
