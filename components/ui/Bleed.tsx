import { ReactNode } from 'react'

interface BleedProps {
  children: ReactNode
  full?: boolean
}

export default function Bleed({ children, full = false }: BleedProps) {
  return (
    <div className={`relative ${full ? 'left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen' : ''}`}>
      {children}
    </div>
  )
}
