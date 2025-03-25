'use client'

import { designSystemUtils, themeColors } from '@/lib/design-system'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import Badge from './Badge'
import { TrendingUp, Calendar, Clock, ArrowRight } from 'lucide-react'

const DarkModeTest = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Dark Mode Test</h1>

      {/* Test Card */}
      <Card variant="interactive" className="relative block overflow-hidden p-6">
        <div className="space-y-5">
          {/* Series Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary" className="inline-flex items-center px-3 py-1.5 text-sm">
                <TrendingUp className="mr-1.5 h-3 w-3" />
                Series
              </Badge>
              <div className={`text-sm ${designSystemUtils.text.muted}`}>5 parts</div>
            </div>
            <h2
              className={`text-xl font-bold leading-7 tracking-tight sm:text-2xl ${themeColors.text.primary}`}
            >
              Test Series
            </h2>
            <div className={`flex items-center space-x-4 text-sm ${designSystemUtils.text.muted}`}>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4" />
                <time>Jan 1, 2024</time>
              </div>
            </div>
          </div>

          {/* Series Parts Preview */}
          <div className="space-y-3">
            <h3 className={`text-sm font-semibold ${themeColors.text.secondary}`}>
              Parts in this series:
            </h3>
            <div className="space-y-2">
              <div
                className={`block rounded-lg border p-3 transition-all hover:border-secondary-300 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-700/50 dark:hover:border-secondary-600 dark:hover:bg-secondary-700 ${themeColors.border.primary} ${themeColors.bg.secondary}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <Badge variant="primary" className="px-2 py-0.5 text-xs font-bold">
                        Part 1
                      </Badge>
                      <div
                        className={`flex items-center space-x-1 text-xs ${designSystemUtils.text.muted}`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>5 min read</span>
                      </div>
                    </div>
                    <h4 className={`line-clamp-2 text-sm font-medium ${themeColors.text.primary}`}>
                      Introduction to the Series
                    </h4>
                  </div>
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-secondary-400 dark:text-secondary-500" />
                </div>
              </div>
            </div>
          </div>

          {/* View Series Button */}
          <div className="pt-2">
            <div
              className={`inline-flex items-center text-sm font-semibold text-primary-600 transition-all duration-200 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 sm:text-base`}
            >
              Start reading series
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>

      {/* Color Test */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800">
          <h3 className="mb-2 font-semibold">Light Mode</h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            This should be visible in both modes
          </p>
        </div>
        <div className="rounded-lg border border-secondary-300 bg-secondary-50 p-4 dark:border-secondary-600 dark:bg-secondary-900">
          <h3 className="mb-2 font-semibold">Dark Mode</h3>
          <p className="text-secondary-700 dark:text-secondary-300">
            This should adapt to the theme
          </p>
        </div>
      </div>
    </div>
  )
}

export default DarkModeTest
