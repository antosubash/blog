import { ReactNode } from 'react'

interface BleedProps {
  children: ReactNode
}

export default function Bleed({ children }: BleedProps) {
  return <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">{children}</div>
}
