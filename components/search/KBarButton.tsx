'use client'

import { useKBar } from 'kbar'
import { ReactNode } from 'react'

interface KBarButtonProps {
  children: ReactNode
  'aria-label'?: string
}

export function KBarButton({ children, 'aria-label': ariaLabel }: KBarButtonProps) {
  const { query } = useKBar()

  return (
    <button onClick={() => query.toggle()} aria-label={ariaLabel} className="cursor-pointer">
      {children}
    </button>
  )
}
