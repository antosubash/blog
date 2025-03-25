import Link from 'next/link'
import { Rss } from 'lucide-react'

export default function FeedButton() {
  return (
    <Link href="/feed.xml" aria-label="RSS Feed">
      <Rss className="h-5 w-5 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400" />
    </Link>
  )
}
