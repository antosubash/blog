import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import { getTagsWithCount } from '@/lib/tag-utils'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagsWithCount = getTagsWithCount()
  return (
    <>
      <div className="pt-12 text-center">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14">
          Tags
        </h1>
      </div>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="flex max-w-7xl flex-wrap">
          {tagsWithCount.length === 0 && 'No tags found.'}
          {tagsWithCount.map((t) => {
            return (
              <div key={t.tag} className="mb-2 mr-5 mt-2">
                <Tag text={t.tag} />
                <Link
                  href={`/tags/${slug(t.tag)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  aria-label={`View posts tagged ${t.tag}`}
                >
                  {` (${t.count})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
