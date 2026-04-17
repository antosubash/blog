import { useEffect, useRef, useState } from "react"

// Global mermaid instance
type MermaidInstance = typeof import("mermaid")["default"]
let mermaidInstance: MermaidInstance | null = null

interface MermaidProps {
  chart: string
  className?: string
}

// Global initialization flag
let isMermaidInitialized = false

const loadMermaid = async () => {
  if (!mermaidInstance) {
    const mermaidModule = await import("mermaid")
    mermaidInstance = mermaidModule.default
  }
  return mermaidInstance
}

const initializeMermaid = async () => {
  if (!isMermaidInitialized && typeof window !== "undefined") {
    const mermaid = await loadMermaid()
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "inherit",
      fontSize: 14,
    })
    isMermaidInitialized = true
  }
}

const Mermaid = ({ chart, className = "" }: MermaidProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [svgContent, setSvgContent] = useState<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const renderMermaid = async () => {
      if (!mounted || !elementRef.current || !chart?.trim()) return

      try {
        setIsLoading(true)
        setError(null)

        const mermaid = await loadMermaid()
        await initializeMermaid()

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // SVG content from mermaid.render is generated locally from
        // our own MDX content, not from user input — safe to use innerHTML
        const { svg } = await mermaid.render(id, chart.trim())
        setSvgContent(svg)
        setIsLoading(false)
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        )
        setIsLoading(false)
      }
    }

    const timer = setTimeout(renderMermaid, 50)
    return () => clearTimeout(timer)
  }, [chart, mounted])

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container || !svgContent || isLoading) return

    const parser = new DOMParser()
    const parsed = parser.parseFromString(svgContent, "image/svg+xml")
    const svg = parsed.documentElement

    container.replaceChildren()
    container.appendChild(svg)

    return () => {
      container.replaceChildren()
    }
  }, [svgContent, isLoading])

  if (error) {
    return (
      <div
        className={`rounded-lg border border-destructive/30 bg-destructive/10 p-4 ${className}`}
      >
        <h3 className="mb-2 text-lg font-semibold text-destructive">
          Mermaid Diagram Error
        </h3>
        <p className="text-sm text-destructive/80">{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-destructive/70">
            Show diagram code
          </summary>
          <pre className="mt-2 rounded bg-destructive/5 p-2 text-xs">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`mermaid-diagram overflow-auto rounded-lg border border-border bg-card p-4 ${className}`}
    >
      {(!mounted || isLoading) && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-muted-foreground">
              {!mounted ? "Loading..." : "Rendering diagram..."}
            </p>
          </div>
        </div>
      )}

      {svgContent && !isLoading && (
        <div ref={svgContainerRef} className="flex justify-center" />
      )}
    </div>
  )
}

export default Mermaid
