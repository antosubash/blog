import { allAuthors } from '@/lib/content'
import type { Authors } from '@/types/content'
import CustomMDXLayoutRenderer from '@/components/CustomMDXLayoutRenderer'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/lib/utils/content-utils'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <CustomMDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
