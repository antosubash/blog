export default function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <div className="space-y-4 sm:space-y-5">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Read more link skeleton */}
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}
