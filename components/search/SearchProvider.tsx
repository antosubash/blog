'use client'

import { KBarProvider } from 'kbar'
import { ReactNode, useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface KBarConfig {
  searchDocumentsPath?: string
}

interface SearchConfig {
  provider?: 'kbar' | 'algolia'
  kbarConfig?: KBarConfig
}

interface SearchProviderProps {
  searchConfig?: SearchConfig
  children: ReactNode
}

interface SearchDoc {
  slug: string
  title: string
  excerpt?: string
}

export default function SearchProvider({ searchConfig, children }: SearchProviderProps) {
  const router = useRouter()
  const [searchDocs, setSearchDocs] = useState<SearchDoc[]>([])

  useEffect(() => {
    if (searchConfig?.kbarConfig?.searchDocumentsPath) {
      fetch(`/${searchConfig.kbarConfig.searchDocumentsPath}`)
        .then((res) => res.json())
        .then(setSearchDocs)
        .catch(console.error)
    }
  }, [searchConfig])

  const actions = useMemo(() => {
    if (!searchDocs.length) return []

    return [
      {
        id: 'search',
        name: 'Search posts...',
        shortcut: ['/'],
        keywords: 'search',
        children: searchDocs.map((doc: SearchDoc) => ({
          id: doc.slug,
          name: doc.title,
          subtitle: doc.excerpt,
          perform: () => {
            router.push(`/posts/${doc.slug}`)
          },
        })),
      },
    ]
  }, [searchDocs, router])

  if (!searchConfig || searchConfig.provider !== 'kbar') {
    return <>{children}</>
  }

  return <KBarProvider actions={actions}>{children}</KBarProvider>
}
