import Link from 'next/link'
import { slug as createSlug } from 'github-slugger'

interface TagProps {
  text: string
  className?: string
}

const Tag = ({ text, className = '' }: TagProps) => {
  const slug = createSlug(text)

  return (
    <Link
      href={`/tags/${slug}`}
      className={`mr-1 mt-1 inline-block rounded-3xl border border-gray-300 px-2 py-1 text-sm font-medium uppercase text-primary-500 transition-colors hover:text-primary-600 dark:border-gray-700 dark:hover:text-primary-400 ${className}`}
      aria-label={`View posts tagged ${text}`}
    >
      {text}
    </Link>
  )
}

export default Tag
