import Link from 'next/link'
import React from 'react'
import { format, parseISO } from 'date-fns'
import Tag from './Tag'

interface PostItemProps {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  series?: string
  part?: number
}

const PostItem = ({ slug, date, title, summary, series, tags, part }: PostItemProps) => {
  return (
    <div className="my-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 drop-shadow-lg transition-all hover:scale-110 dark:border-gray-800 dark:bg-gray-950">
      <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <div>
          <div className="text-base font-medium leading-6 ">
            <time dateTime={date}>{format(parseISO(date), 'LLLL d, yyyy')}</time>
          </div>
          {series && (
            <div className="pt-4">
              <div className="flex flex-col text-xl font-bold leading-6">
                {series}{' '}
                {part ? (
                  <div className="pt-4 text-xl font-bold leading-6 lg:block lg:px-0">
                    Part : {part}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-5 xl:col-span-3">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                <Link href={`/posts/${slug}`}>{title}</Link>
              </h2>
            </div>
            <div>{summary}</div>
          </div>
          <div className="text-base font-medium leading-6">
            <Link
              href={`/posts/${slug}`}
              className="text-primary-800 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-400"
            >
              Read more &rarr;
            </Link>
          </div>
          <div className="flex flex-row flex-wrap">
            {tags.map((tag, index) => (
              <div className="mt-3" key={tag}>
                <Tag text={tag} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem
