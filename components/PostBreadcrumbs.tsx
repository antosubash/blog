import Link from '@/components/Link'
import { ChevronRight, Home } from 'lucide-react'

interface PostBreadcrumbsProps {
  title: string
  slug: string
}

export default function PostBreadcrumbs({ title, slug }: PostBreadcrumbsProps) {
  const slugParts = slug.split('/')
  const category = slugParts[0]

  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Link
        href="/"
        className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <ChevronRight className="h-4 w-4" />

      <Link href="/posts" className="hover:text-gray-900 dark:hover:text-gray-100">
        Blog
      </Link>

      {category && category !== 'posts' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/posts/${category}`}
            className="capitalize hover:text-gray-900 dark:hover:text-gray-100"
          >
            {category}
          </Link>
        </>
      )}

      <ChevronRight className="h-4 w-4" />

      <span className="truncate text-gray-900 dark:text-gray-100" title={title}>
        {title}
      </span>
    </nav>
  )
}
