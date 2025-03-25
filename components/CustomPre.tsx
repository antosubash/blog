'use client'

import { ReactNode } from 'react'

interface CustomPreProps {
  children: ReactNode
  className?: string
}

const CustomPre = ({ children, className }: CustomPreProps) => {
  return (
    <pre
      className={`overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 ${className || ''}`}
    >
      {children}
    </pre>
  )
}

export default CustomPre
