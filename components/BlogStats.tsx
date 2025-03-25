import { Calendar, FileText, Tag, Eye } from 'lucide-react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Posts } from 'contentlayer/generated'

interface BlogStatsProps {
  posts: CoreContent<Posts>[]
}

// Simple number formatting function that's consistent across server and client
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function BlogStats({ posts }: BlogStatsProps) {
  // Calculate statistics
  const totalPosts = posts.length
  const totalTags = new Set(posts.flatMap((post) => post.tags || [])).size
  const totalWords = posts.reduce((sum, post) => {
    return sum + (post.excerpt?.split(/\s+/).length || 0)
  }, 0)
  const averageReadingTime = Math.round(totalWords / 200) // Assuming 200 words per minute

  const stats = [
    {
      label: 'Total Articles',
      value: totalPosts,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Topics Covered',
      value: totalTags,
      icon: Tag,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Total Words',
      value: totalWords.toLocaleString('en-US'),
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Reading Time',
      value: `${averageReadingTime} min`,
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
