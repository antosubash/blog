import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-6">
      {children}
    </section>
  )
}
