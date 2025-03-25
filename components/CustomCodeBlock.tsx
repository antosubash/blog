'use client'

import { ReactNode } from 'react'
import Mermaid from './Mermaid'

interface CustomCodeBlockProps {
  children: ReactNode
  className?: string
}

const CustomCodeBlock = ({ children, className = '' }: CustomCodeBlockProps) => {
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

    // Debug logging
    console.log('Mermaid code extracted:', mermaidCode)
    console.log('Children type:', typeof children, Array.isArray(children) ? 'array' : 'not array')
    console.log('Children:', children)

    return <Mermaid chart={mermaidCode} className="my-6" />
  }

  // For non-mermaid code blocks, use the existing CustomPre styling
  return (
    <pre
      className={`overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 ${className || ''}`}
    >
      {children}
    </pre>
  )
}

export default CustomCodeBlock
