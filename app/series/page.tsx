'use client'

import { format, parseISO } from 'date-fns'
import { ArrowRight, BookOpen, Calendar, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import Tag from '@/components/Tag'
import Badge from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { designSystemUtils, themeColors } from '@/lib/design-system'
import { getAllSeries } from '@/lib/series-utils'

const Series = () => {
  // Get all series posts and group them
  const seriesGroups = useMemo(() => getAllSeries(), [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-900/20`}
    >
      <div className={designSystemUtils.layout.container}>
        {/* Hero Section */}
        <div className={designSystemUtils.spacing.section}>
          <div className="px-4 text-center">
            <div className="mb-6 flex justify-center">
              <Badge
                variant="primary"
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Series Collection</span>
              </Badge>
            </div>
            <h1 className={designSystemUtils.text.h1}>Blog Series</h1>
            <p className={`mx-auto mt-6 max-w-2xl text-lg ${designSystemUtils.text.muted}`}>
              Explore comprehensive guides and tutorials organized in series. From beginner to
              advanced, follow structured learning paths to master new technologies and concepts.
            </p>
            <div
              className={`mt-8 flex items-center justify-center space-x-6 text-sm ${designSystemUtils.text.muted}`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{seriesGroups.length} Series</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className={designSystemUtils.layout.grid['cards']}>
            {seriesGroups.map((series) => (
              <Link
                key={series.name}
                href={`/posts/${series.posts[0].slug}`}
                className="group h-full"
              >
                <Card
                  variant="interactive"
                  className="relative block flex h-full flex-col overflow-hidden p-6"
                >
                  <div className="flex-1 space-y-5">
                    {/* Series Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="primary"
                          className="inline-flex items-center px-3 py-1.5 text-sm"
                        >
                          <TrendingUp className="mr-1.5 h-3 w-3" />
                          Series
                        </Badge>
                        <div className={`text-sm ${designSystemUtils.text.muted}`}>
                          {series.totalParts} parts
                        </div>
                      </div>
                      <h2
                        className={`text-xl font-bold leading-7 tracking-tight sm:text-2xl ${themeColors.text.primary}`}
                      >
                        {series.name}
                      </h2>
                      <div
                        className={`flex items-center space-x-4 text-sm ${designSystemUtils.text.muted}`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={series.latestDate}>
                            {format(parseISO(series.latestDate), 'MMM d, yyyy')}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Series Parts Preview */}
                    <div className="flex-1 space-y-3">
                      <h3 className={`text-sm font-semibold ${themeColors.text.secondary}`}>
                        Parts in this series:
                      </h3>
                      <div className="min-h-[120px] space-y-2">
                        {series.posts.slice(0, 3).map((post) => (
                          <div
                            key={post.slug}
                            className={`block rounded-lg border p-3 transition-all hover:border-secondary-300 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-700/50 dark:hover:border-secondary-600 dark:hover:bg-secondary-700 ${themeColors.border.primary} ${themeColors.bg.secondary}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center space-x-2">
                                  <Badge
                                    variant="primary"
                                    className="px-2 py-0.5 text-xs font-bold"
                                  >
                                    Part {post.part}
                                  </Badge>
                                  {post.readingTime && (
                                    <div
                                      className={`flex items-center space-x-1 text-xs ${designSystemUtils.text.muted}`}
                                    >
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {typeof post.readingTime === 'string'
                                          ? post.readingTime
                                          : (post.readingTime as { text: string })?.text}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <h4
                                  className={`line-clamp-2 text-sm font-medium ${themeColors.text.primary}`}
                                >
                                  {post.title}
                                </h4>
                              </div>
                              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-secondary-400 dark:text-secondary-500" />
                            </div>
                          </div>
                        ))}
                        {series.posts.length > 3 && (
                          <div className="text-center">
                            <span className={`text-sm ${designSystemUtils.text.muted}`}>
                              +{series.posts.length - 3} more parts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {series.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {series.tags.slice(0, 4).map((tag) => (
                          <Tag key={tag} text={tag} asLink={false} />
                        ))}
                        {series.tags.length > 4 && (
                          <Badge variant="secondary" className="text-sm">
                            +{series.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* View Series Button */}
                    <div className="mt-auto pt-2">
                      <div
                        className={`inline-flex items-center text-sm font-semibold text-primary-600 transition-all duration-200 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 sm:text-base`}
                      >
                        Start reading series
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-primary-900/20" />

                  {/* Subtle border animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-accent-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Series
