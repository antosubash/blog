'use client'

import { Check, Copy } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import Mermaid from './Mermaid'

interface EnhancedCodeBlockProps {
  children: ReactNode
  className?: string
}

const EnhancedCodeBlock = ({ children, className = '' }: EnhancedCodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  // Check if this is a mermaid code block
  if (className && className.includes('language-mermaid')) {
    // Extract the mermaid code from children
    let mermaidCode = ''

    // Helper function to extract text from React elements
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

    mermaidCode = extractText(children).trim()
    return <Mermaid chart={mermaidCode} className="my-6" />
  }

  // Extract code content for copying
  const extractCodeContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(extractCodeContent).join('')
    if (node && typeof node === 'object' && 'props' in node) {
      const reactElement = node as { props: { children?: ReactNode } }
      return extractCodeContent(reactElement.props.children || '')
    }
    return ''
  }

  const codeContent = extractCodeContent(children)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Get language from className
  const language = className?.replace('language-', '') || ''

  return (
    <div className="group relative">
      {/* Code block with enhanced styling */}
      <pre
        className={`overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-6 text-base text-gray-100 shadow-lg ${className || ''}`}
        style={{ fontSize: '1rem', lineHeight: '1.6' }}
      >
        {/* Language badge */}
        {language && (
          <div className="absolute left-2 top-2">
            <span className="inline-block rounded bg-gray-800 px-2 py-1 text-xs font-medium text-gray-300">
              {language}
            </span>
          </div>
        )}

        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 rounded bg-gray-700 p-2 text-gray-300 opacity-0 transition-opacity duration-200 hover:bg-gray-600 hover:text-white group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>

        {/* Code content with padding for badges */}
        <div className={language ? 'pt-8' : ''}>{children}</div>
      </pre>
    </div>
  )
}

export default EnhancedCodeBlock
