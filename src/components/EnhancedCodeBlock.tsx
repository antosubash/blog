import { type ReactNode, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Mermaid from './Mermaid'

interface EnhancedCodeBlockProps {
  children: ReactNode
  className?: string
}

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    const reactElement = node as { props: { children?: ReactNode } }
    return extractText(reactElement.props.children || '')
  }
  return ''
}

const EnhancedCodeBlock = ({ children, className = '' }: EnhancedCodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  if (className?.includes('language-mermaid')) {
    const mermaidCode = extractText(children).trim()
    return <Mermaid chart={mermaidCode} className="my-6" />
  }

  const codeContent = extractText(children)
  const language = className?.replace('language-', '') || ''

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may be unavailable in some contexts
    }
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-border">
      {/* Terminal-style header bar */}
      <div className="flex items-center justify-between bg-surface px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <pre
        className={`overflow-x-auto bg-background p-4 text-sm leading-relaxed text-foreground ${className}`}
      >
        {children}
      </pre>
    </div>
  )
}

export default EnhancedCodeBlock
